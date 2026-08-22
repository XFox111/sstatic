import { createContext } from "react";
import type { DirectoryChild, DirectoryDetails, FileDetails } from "../../api";

export default createContext<FilesContextType>(null!);

export type SourceItem =
	{
		items: DirectoryChild[];
		parent: DirectoryDetails;
	};

export type FilesContextType =
	{
		isLoading: boolean;
		error: string | null;
		rootFolder: DirectoryDetails;
		currentFolder: DirectoryDetails;
		setCurrentFolder(folder: DirectoryDetails): void;
		fetchChildren(folder: DirectoryDetails): Promise<DirectoryDetails>;

		createFolder(): void;
		createFile(): void;
		uploadFiles(folder?: DirectoryDetails, files?: FileList): void;

		moveItems(source: SourceItem, destination: DirectoryDetails): void;
		renameItem(item: DirectoryChild): void;
		deleteItems(...items: DirectoryChild[]): void;

		showEditor(file: FileDetails): void;
		showDetails(item: DirectoryChild): void;
		createShortLink(file: FileDetails): void;

		getUrl(file: FileDetails, download?: boolean): string;
		copyUrl(file: FileDetails): void;
	};
