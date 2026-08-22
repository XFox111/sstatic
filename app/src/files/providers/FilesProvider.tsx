import { Button, Field, Link, ProgressBar, Spinner, Toast, ToastBody, ToastFooter, ToastTitle, Tooltip, useToastController, type ToastTitleProps } from "@fluentui/react-components";
import { Dismiss16Regular } from "@fluentui/react-icons";
import { useCallback, useEffect, useState } from "react";
import type { ApiResponse, DirectoryChild, DirectoryDetails, FileDetails, ItemType, ShortLink } from "../../api";
import { files as filesApi } from "../../api";
import ToastDismissButton from "../../components/ToastDismissButton";
import UrlCopiedToast from "../../components/UrlCopiedToast";
import useDialog from "../../hooks/useDialog";
import useRuntimeInfo from "../../hooks/useRuntimeInfo";
import EditLinkDialog from "../../shortener/dialogs/EditLinkDialog";
import { preventPageUnload, type PreventPageUnloadHandler } from "../../utils";
import FilesContext, { type SourceItem } from "../contexts/FilesContext";
import AboutDialog from "../dialogs/AboutDialog";
import EditFileDialog from "../dialogs/EditFileDialog";
import TextEditorDialog from "../dialogs/TextEditorDialog";
import { bytesToSize, getFolderFromPath, isTextMimeType, pickFiles, replaceFolderInTree } from "../utils";
import CurrentFolderProvider from "./CurrentFolderProvider";

export default function FilesProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const dialog = useDialog();
	const toaster = useToastController();
	const { filesBaseUrl, shortenerBaseUrl, maxFileSize } = useRuntimeInfo();
	const [error, setError] = useState<string | null>(null);
	const [rootFolder, setRootFolder] = useState<DirectoryDetails>(null!);
	const [currentFolder, setCurrentFolder] = useState<DirectoryDetails>(null!);

	const updateFolder = useCallback((folder: DirectoryDetails): void =>
	{
		if (currentFolder.path === folder.path)
			setCurrentFolder(folder);

		setRootFolder(current => replaceFolderInTree(current, folder));
	}, [currentFolder]);

	const fetchChildren = useCallback(async (folder: DirectoryDetails): Promise<DirectoryDetails> =>
	{
		if (folder.children)
			return folder;

		setError(null);
		const [success, result] = await filesApi.getInfo(folder.path);

		if (success)
		{
			updateFolder(result as DirectoryDetails);
			return result as DirectoryDetails;
		}
		else
		{
			setError(result.detail || result.title);
			return folder;
		}
	}, [updateFolder]);

	async function createItem(type: ItemType): Promise<void>
	{
		const newItem: DirectoryChild | null = await dialog.pushCustom(EditFileDialog, { type });

		if (!newItem)
			return;

		updateFolder({ ...currentFolder, children: [...currentFolder.children!, newItem] });
	}

	async function uploadFiles(folder: DirectoryDetails, fileList?: FileList | null): Promise<void>
	{
		folder ??= currentFolder;
		fileList ??= await pickFiles();

		if (!fileList)
			return;

		const files: File[] = [];

		for (const file of fileList)
		{
			console.log(file);

			if (maxFileSize > 0 && file.size > maxFileSize)
				toaster.dispatchToast(
					<Toast>
						<ToastTitle>File size of "{file.name}" exceeds {bytesToSize(maxFileSize)}</ToastTitle>
					</Toast>
				);
			else
				files.push(file);
		}

		if (files.length < 1)
			return;

		folder = await fetchChildren(folder);

		const existingFiles: string[] = files.filter(i => folder.children!.some(j => j.name === i.name))
			.map(i => i.name);

		if (existingFiles.length > 0)
		{
			const proceed: boolean = await dialog.pushPrompt({
				title: existingFiles.length > 1
					? "Some files already exist"
					: `File "${existingFiles[0]}" already exists`,
				content: existingFiles.length > 1
					? `Following files will be overwritten:\n\n${existingFiles.join("\n")}\n\nDo you want to continue?`
					: `File "${existingFiles[0]}" will be overwritten. Do you want to continue?`,
				confirmText: "Replace",
				destructive: true
			});

			if (!proceed)
				return;
		}

		const toastId: string = Date.now() + "_FileTreeProvider_uploadFiles";
		const abortController: AbortController = new AbortController();
		const pageBlock: PreventPageUnloadHandler = preventPageUnload();
		const cancelUploadButton: ToastTitleProps["action"] = (
			<Tooltip relationship="label" content="Cancel upload">
				<Button appearance="subtle" size="small" icon={<Dismiss16Regular />}
					onClick={() => abortController.abort()}
				/>
			</Tooltip>
		);

		if (files.length > 1)
			await uploadMultipleFiles();
		else
			await uploadSingleFile();

		pageBlock.release();

		async function uploadSingleFile(): Promise<void>
		{
			const file: File = files[0];

			toaster.dispatchToast(
				<Toast>
					<ToastTitle media={<Spinner size="tiny" />} action={cancelUploadButton}>
						Uploading file "{file.name}" into "{folder.name}"
					</ToastTitle>
					<ToastBody>
						<ProgressBar thickness="large" value={0} max={100} />
					</ToastBody>
				</Toast>,
				{ toastId, timeout: -1 }
			);

			function onProgress(progress: number): void
			{
				toaster.updateToast({
					toastId, timeout: -1,
					content: <Toast>
						<ToastTitle media={<Spinner size="tiny" />} action={cancelUploadButton}>
							Uploading file "{file.name}" into "{folder.name}"
						</ToastTitle>
						<ToastBody>
							<ProgressBar thickness="large" value={progress} max={100} />
						</ToastBody>
					</Toast>
				});
			}

			const [success, result] = await filesApi.upload(folder.path, file, onProgress, abortController.signal);

			if (success)
			{
				updateFolder({ ...folder, children: [...folder.children!, result] });
				toaster.updateToast({
					toastId, intent: "success", timeout: 3000,
					content: <Toast>
						<ToastTitle>Uploaded file "{file.name}" into "{folder.name}"</ToastTitle>
					</Toast>
				});
			}
			else if (result.type === "client-abort")
				toaster.updateToast({
					toastId, intent: "info", timeout: 3000,
					content: <Toast>
						<ToastTitle>File upload was canceled</ToastTitle>
					</Toast>
				});
			else
				toaster.updateToast({
					toastId, intent: "error", timeout: -1,
					content: <Toast>
						<ToastTitle action={<ToastDismissButton />}>
							Failed to upload file "{file.name}" into "{folder.name}"
						</ToastTitle>
						<ToastBody>{result.detail || result.title}</ToastBody>
					</Toast>
				});
		}

		async function uploadMultipleFiles(): Promise<void>
		{
			const maxProgress: number = files.length * 100;
			const progress: Record<string, number> = {};
			let completedCount: number = 0;
			const tasks: Promise<ApiResponse<FileDetails>>[] = [];

			toaster.dispatchToast(
				<Toast>
					<ToastTitle media={<Spinner size="tiny" />} action={cancelUploadButton}>
						Uploading {files.length} files into "{folder.name}"
					</ToastTitle>
					<ToastBody>
						<Field hint={`0 of ${files.length}`}>
							<ProgressBar thickness="large" value={0} max={maxProgress} />
						</Field>
					</ToastBody>
				</Toast>,
				{ toastId, timeout: -1 }
			);

			for (const file of files)
			{
				function onProgress(fileProgress: number): void
				{
					progress[file.name] = fileProgress;
					const totalProgress: number = Object.values(progress).reduce((a, b) => a + b, 0);

					toaster.updateToast({
						toastId, timeout: -1,
						content: <Toast>
							<ToastTitle media={<Spinner size="tiny" />} action={cancelUploadButton}>
								Uploading {files.length} files into "{folder.name}"
							</ToastTitle>
							<ToastBody>
								<Field hint={`${completedCount} of ${files.length}`}>
									<ProgressBar thickness="large" value={totalProgress} max={maxProgress} />
								</Field>
							</ToastBody>
						</Toast>
					});
				}

				async function task(): Promise<ApiResponse<FileDetails>>
				{
					const response = await filesApi.upload(folder.path, file, onProgress, abortController.signal);
					const [success, result] = response;

					if (success)
					{
						folder = { ...folder, children: [...folder.children!, result] };
						updateFolder(folder);
						progress[file.name] = 100;
						completedCount++;
					}
					else if (result.type !== "client-abort")
						toaster.dispatchToast(
							<Toast>
								<ToastTitle action={<ToastDismissButton />}>
									Failed to upload file "{file.name}"
								</ToastTitle>
								<ToastBody>{result.detail || result.title}</ToastBody>
							</Toast>,
							{ timeout: -1, intent: "error" }
						);

					return response;
				}

				tasks.push(task());
			}

			const results: ApiResponse<FileDetails>[] = await Promise.all(tasks);

			if (completedCount >= files.length)
				toaster.updateToast({
					toastId, intent: "success", timeout: 3000,
					content: <Toast>
						<ToastTitle>{files.length} files were uploaded into "{folder.name}"</ToastTitle>
					</Toast>
				});
			else if (results.some(([success, result]) => !success && result.type === "client-abort"))
				toaster.updateToast({
					toastId, intent: "info", timeout: 3000,
					content: <Toast>
						<ToastTitle>File upload was cancelled</ToastTitle>
					</Toast>
				});
			else
				toaster.updateToast({
					toastId, timeout: 3000,
					intent: completedCount > 0 ? "warning" : "error",
					content: <Toast>
						<ToastTitle>Failed to upload {files.length - completedCount} files into "{folder.name}"</ToastTitle>
					</Toast>
				});
		}
	}

	async function moveItems(source: SourceItem, destination: DirectoryDetails): Promise<void>
	{
		if (source.items.length < 1 || source.parent.path === destination.path)
			return;

		const { items, parent } = source;
		const toastId: string = Date.now() + "_FileTreeProvider_moveItems";

		let srcFolder: DirectoryDetails = getFolderFromPath(rootFolder, parent.path);
		let destFolder: DirectoryDetails = { ...destination };

		if (items.length < 2)
			await moveSingleItem();
		else
			await moveMultipleItems();

		function updateFile(originalPath: string, updatedItem: DirectoryChild): void
		{
			srcFolder.children = srcFolder.children ? [...srcFolder.children.filter(i => i.path !== originalPath)] : undefined;
			destFolder.children = destFolder.children ? [...destFolder.children, updatedItem] : undefined;

			if (destination.path.startsWith(parent.path)) // destination folder is a child of source folder
				srcFolder = replaceFolderInTree(srcFolder, destFolder);
			else if (parent.path.startsWith(destination.path)) // source folder is a child of destination folder
				destFolder = replaceFolderInTree(destFolder, srcFolder);

			if (destFolder.path === currentFolder.path)
				setCurrentFolder(destFolder);
			else if (srcFolder.path === currentFolder.path)
				setCurrentFolder(srcFolder);

			setRootFolder(current =>
				replaceFolderInTree(
					replaceFolderInTree(current, srcFolder),
					destFolder
				)
			);
		}

		async function moveSingleItem(): Promise<void>
		{
			const item: DirectoryChild = items[0];

			toaster.dispatchToast(
				<Toast>
					<ToastTitle media={<Spinner size="tiny" />}>
						Moving "{item.name}" into "{destination.name}"
					</ToastTitle>
				</Toast>,
				{ toastId, timeout: -1 }
			);

			const [success, result] = await filesApi.move(
				item.path,
				destination.path ? destination.path + "/" + item.name : item.name
			);

			if (success)
			{
				updateFile(item.path, result);
				toaster.updateToast({
					toastId, intent: "success", timeout: 3000,
					content: <Toast>
						<ToastTitle>
							Moved "{item.name}" into "{destination.name}"
						</ToastTitle>
					</Toast>
				});
			}
			else
				toaster.updateToast({
					toastId, intent: "error", timeout: -1,
					content: <Toast>
						<ToastTitle action={<ToastDismissButton />} >
							Failed to move "{item.name}" into "{destination.name}"
						</ToastTitle>
						<ToastBody>{result.detail || result.title}</ToastBody>
					</Toast>
				});
		}

		async function moveMultipleItems(): Promise<void>
		{
			let completedCount: number = 0;

			toaster.dispatchToast(
				<Toast>
					<ToastTitle media={<Spinner size="tiny" />}>
						Moving {items.length} files into "{destination.name}"
					</ToastTitle>
					<ToastBody>
						<Field hint={`0 of ${items.length}`}>
							<ProgressBar thickness="large" value={0} max={items.length} />
						</Field>
					</ToastBody>
				</Toast>,
				{ toastId, timeout: -1 }
			);

			for (const item of items)
			{
				const [success, result] = await filesApi.move(
					item.path,
					destination.path ? destination.path + "/" + item.name : item.name
				);

				if (success)
				{
					updateFile(item.path, result);
					completedCount++;
					toaster.updateToast({
						toastId, timeout: -1,
						content: <Toast>
							<ToastTitle media={<Spinner size="tiny" />}>
								Moving {items.length} files into "{destination.name}"
							</ToastTitle>
							<ToastBody>
								<Field hint={`${completedCount} of ${items.length}`}>
									<ProgressBar thickness="large" value={completedCount} max={items.length} />
								</Field>
							</ToastBody>
						</Toast>
					});
				}
				else
					toaster.dispatchToast(
						<Toast>
							<ToastTitle action={<ToastDismissButton />}>
								Failed to move "{item.name}" into "{destination.name}"
							</ToastTitle>
							<ToastBody>{result.detail || result.title}</ToastBody>
						</Toast>,
						{ intent: "error", timeout: -1 }
					);
			}

			if (completedCount >= items.length)
				toaster.updateToast({
					toastId, intent: "success", timeout: 3000,
					content: <Toast>
						<ToastTitle>Moved {items.length} files into "{destination.name}"</ToastTitle>
					</Toast>
				});
			else if (completedCount < 1)
				toaster.updateToast({
					toastId, intent: "error", timeout: 3000,
					content: <Toast>
						<ToastTitle>Failed to move files into "{destination.name}"</ToastTitle>
					</Toast>
				});
			else
				toaster.updateToast({
					toastId, intent: "warning", timeout: 3000,
					content: <Toast>
						<ToastTitle>
							Failed to move {items.length - completedCount} files into "{destination.name}"
						</ToastTitle>
					</Toast>
				});
		}
	}

	async function renameItem(item: DirectoryChild): Promise<void>
	{
		const updatedItem: DirectoryChild | null = await dialog.pushCustom(EditFileDialog, { item });

		if (!updatedItem)
			return;

		const updatedFolder: DirectoryDetails =
		{
			...currentFolder,
			children: currentFolder.children!.map(i => i.path === item.path ? updatedItem : i)
		};
		updateFolder(updatedFolder);
	}

	function deleteItems(...items: DirectoryChild[]): void
	{
		if (items.length < 1)
			return;

		let updatedFolder: DirectoryDetails = currentFolder;

		async function onConfirm(setError: (error: string) => void): Promise<boolean>
		{
			for (const item of items)
			{
				const [success, result] = await filesApi.delete(item.path);

				if (!success && result.status !== 404)
				{
					setError(result.detail || result.title);
					return false;
				}

				updatedFolder = {
					...updatedFolder,
					children: updatedFolder.children!.filter(i => i.path !== item.path)
				};

				updateFolder(updatedFolder);
			}

			return true;
		}

		dialog.pushPrompt({
			...(items.length > 1
				? {
					title: "Delete files",
					content: `Are you sure you want to delete ${items.length} files? This action cannot be undone.`
				}
				: {
					title: "Delete file",
					content: `Are you sure you want to delete "${items[0].name}"? This action cannot be undone.`
				}
			),
			confirmText: "Delete",
			destructive: true,
			onConfirm
		});
	}

	async function showEditor(file: FileDetails): Promise<void>
	{
		if (!isTextMimeType(file.mime))
		{
			const proceed: boolean = await dialog.pushPrompt({
				title: "Unknown file type",
				content: `We don't recongnize "${file.name}" as a text file. Opening binary files in a text editor may cause file corruption.`,
				confirmText: "Open anyway",
				destructive: true
			});

			if (!proceed)
				return;
		}

		if (file.size > 4_194_304) // 4 MB
		{
			const proceed: boolean = await dialog.pushPrompt({
				title: "Large file",
				content: `The file "${file.name}" is larger than 4 MiB. Opening large files in a text editor may cause performance issues.`,
				confirmText: "Open anyway",
				destructive: true
			});

			if (!proceed)
				return;
		}

		const updatedFile: FileDetails | null = await dialog.pushCustom(TextEditorDialog, { file });

		if (!updatedFile)
			return;

		const updatedFolder: DirectoryDetails =
		{
			...currentFolder,
			children: currentFolder.children!.map(i => i.path === updatedFile.path ? updatedFile : i)
		};
		updateFolder(updatedFolder);
	}

	async function createShortLink(file: FileDetails): Promise<void>
	{
		const link: ShortLink | null = await dialog.pushCustom(EditLinkDialog, { suggestedUrl: getUrl(file) });

		if (!link)
			return;

		const toastId: string = Date.now() + "_FileTreeProvider_createShortLink";

		toaster.dispatchToast(
			<Toast>
				<ToastTitle>Short URL created</ToastTitle>
				<ToastBody>{shortenerBaseUrl}{link.slug}</ToastBody>
				<ToastFooter>
					<Link
						onClick={() =>
						{
							const url: string = `${window.location.protocol}//${shortenerBaseUrl}${link.slug}`;
							navigator.clipboard.writeText(url);
							toaster.updateToast({
								toastId, intent: "success", timeout: 3000,
								content: <UrlCopiedToast />
							});
						}}
					>
						Copy link
					</Link>
				</ToastFooter>
			</Toast>,
			{ intent: "success", toastId, timeout: 5000 }
		);
	}

	function getUrl(file: FileDetails, download: boolean = false): string
	{
		return download
			? `${window.location.protocol}//${filesBaseUrl}${file.path}?download=true`
			: `${window.location.protocol}//${filesBaseUrl}${file.path}`;
	}

	function copyUrl(file: FileDetails): void
	{
		const url = getUrl(file);
		navigator.clipboard.writeText(url);
		toaster.dispatchToast(<UrlCopiedToast />, { intent: "success" });
	}

	useEffect(() =>
	{
		async function fetchRoot(): Promise<void>
		{
			const [success, result] = await filesApi.getInfo("");

			if (success)
			{
				setRootFolder(result as DirectoryDetails);
				setCurrentFolder(result as DirectoryDetails);
			}
			else
				setError(result.detail || result.title);
		}

		fetchRoot();
	}, []);

	useEffect(() =>
	{
		if (currentFolder && !currentFolder.children)
			fetchChildren(currentFolder);

	}, [currentFolder, fetchChildren]);

	return (
		<FilesContext.Provider value={{
			isLoading: !rootFolder,
			error, rootFolder, currentFolder, setCurrentFolder,
			fetchChildren,
			createFolder: () => createItem("directory"),
			createFile: () => createItem("file"),
			uploadFiles,
			moveItems, renameItem, deleteItems,
			showEditor,
			showDetails: item => dialog.pushCustom(AboutDialog, { item }),
			createShortLink,
			getUrl, copyUrl
		}}>
			<CurrentFolderProvider>
				{children}
			</CurrentFolderProvider>
		</FilesContext.Provider>
	);
}
