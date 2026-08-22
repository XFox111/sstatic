import { Button, Divider, makeStyles, Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger, tokens, Tooltip } from "@fluentui/react-components";
import { Add20Regular, ArrowClockwise20Regular, ArrowDownload20Regular, ArrowSortDownLines20Regular, ArrowUpload20Regular, bundleIcon, ClipboardLink20Regular, ClipboardPaste20Regular, Cut20Regular, Delete20Filled, Delete20Regular, Dismiss20Regular, DocumentAdd20Filled, DocumentAdd20Regular, DocumentEdit20Regular, FolderAdd20Filled, FolderAdd20Regular, Info20Filled, Info20Regular, MoreHorizontal20Regular, Rename20Regular } from "@fluentui/react-icons";
import type { DirectoryChild, FileDetails } from "../../api";
import { useDangerStyles } from "../../hooks/useDangerStyles";
import useMediaQuery from "../../hooks/useMediaQuery";
import useCurrentFolder from "../hooks/useCurrentFolder";
import useFiles from "../hooks/useFiles";
import SortMenu from "./SortMenu";

export default function FolderToolbar(): React.ReactElement
{
	const { selectedItems, folder, isLoading, ...currentFolder } = useCurrentFolder();
	const files = useFiles();
	const isSingle = selectedItems.length === 1;
	const selectedItem: DirectoryChild | null = selectedItems.length > 0
		? selectedItems[0] : null;

	const hideBaseMenu = useMediaQuery("(max-width: 768px)");
	const minimizeTextEditorButton = useMediaQuery("(max-width: 1400px)");
	const minimizeClearButton = useMediaQuery("(max-width: 540px)");
	const dangerCls = useDangerStyles();
	const cls = useStyles();

	if (selectedItem === null)
		return (
			<div className={cls.toolbar}>
				{hideBaseMenu ?
					<Menu hasIcons>
						<MenuTrigger>
							<Button appearance="subtle" icon={<MoreHorizontal20Regular />} />
						</MenuTrigger>

						<MenuPopover>
							<MenuList>
								<SortMenu>
									<MenuItem icon={<ArrowSortDownLines20Regular />}>Sort</MenuItem>
								</SortMenu>
								<MenuItem icon={<ArrowClockwise20Regular />}
									disabled={isLoading}
									onClick={() => currentFolder.setFolder({ ...folder, children: undefined })}
								>
									Refresh
								</MenuItem>
								<MenuItem icon={<ClipboardPaste20Regular />}
									disabled={currentFolder.cutItems === null || isLoading}
									onClick={currentFolder.paste}
								>
									Paste
								</MenuItem>
							</MenuList>
						</MenuPopover>
					</Menu>
					:
					<>
						<SortMenu>
							<MenuButton appearance="subtle" icon={<ArrowSortDownLines20Regular />}
								disabled={isLoading}
							>
								Sort
							</MenuButton>
						</SortMenu>
						<Divider vertical />
						<Tooltip relationship="label" content="Refresh">
							<Button
								appearance="subtle"
								icon={<ArrowClockwise20Regular />}
								disabled={isLoading}
								onClick={() => currentFolder.setFolder({ ...folder, children: undefined })}
							/>
						</Tooltip>
						<Tooltip relationship="label" content="Paste">
							<Button
								appearance="subtle"
								icon={<ClipboardPaste20Regular />}
								disabled={currentFolder.cutItems === null || isLoading}
								onClick={currentFolder.paste}
							/>
						</Tooltip>
					</>
				}
				<Menu hasIcons>
					<MenuTrigger disableButtonEnhancement>
						<Button appearance="primary" icon={<Add20Regular />} disabled={isLoading}>
							Create
						</Button>
					</MenuTrigger>

					<MenuPopover>
						<MenuList>
							<MenuItem icon={<NewDirIcon />} onClick={files.createFolder}>
								New folder
							</MenuItem>
							<MenuItem icon={<NewFileIcon />} onClick={files.createFile}>
								Empty file
							</MenuItem>
							<MenuDivider />
							<MenuItem icon={<ArrowUpload20Regular />} onClick={() => files.uploadFiles()}>
								Upload files
							</MenuItem>
						</MenuList>
					</MenuPopover>
				</Menu>
			</div>
		);

	return (
		<div className={cls.selectionToolbar}>
			{minimizeClearButton && selectedItem.type === "file" && isSingle ?
				<Tooltip relationship="label" content="Clear selection">
					<Button
						shape="circular" appearance="subtle" icon={<Dismiss20Regular />}
						onClick={() => currentFolder.setSelectedItems([])}
					/>
				</Tooltip>
				:
				<Button
					shape="circular" appearance="subtle" icon={<Dismiss20Regular />}
					onClick={() => currentFolder.setSelectedItems([])}
				>
					Clear selection
				</Button>
			}
			<div className={cls.selectionToolbar_actions}>
				{isSingle && <>
					{selectedItem.type === "file" && <>
						<Button appearance="primary" icon={<ClipboardLink20Regular />}
							onClick={() => files.copyUrl(selectedItem)}
						>
							Copy link
						</Button>
						{minimizeTextEditorButton ?
							<Tooltip relationship="label" content="Open in text editor">
								<Button appearance="subtle" icon={<DocumentEdit20Regular />}
									onClick={() => files.showEditor(selectedItem as FileDetails)}
								/>
							</Tooltip>
							:
							<Button appearance="subtle" icon={<DocumentEdit20Regular />}
								onClick={() => files.showEditor(selectedItem as FileDetails)}
							>
								Open in text editor
							</Button>
						}
						<Tooltip relationship="label" content="Download">
							<Button appearance="subtle" icon={<ArrowDownload20Regular />}
								as="a" target="_blank"
								href={files.getUrl(selectedItem, true)}
							/>
						</Tooltip>
					</>}
					<Tooltip relationship="label" content="Rename">
						<Button appearance="subtle" icon={<Rename20Regular />}
							onClick={() => files.renameItem(selectedItem)}
						/>
					</Tooltip>
				</>}
				<Tooltip relationship="label" content="Cut">
					<Button appearance="subtle" icon={<Cut20Regular />}
						onClick={() => selectedItems.length > 0 && currentFolder.cut(...selectedItems)}
					/>
				</Tooltip>
				<Tooltip relationship="label" content="Delete">
					<Button appearance="subtle" icon={<DeleteIcon />}
						className={dangerCls.buttonSubtle}
						onClick={() => files.deleteItems(...selectedItems)}
					/>
				</Tooltip>
				{isSingle &&
					<Tooltip relationship="label" content="About">
						<Button appearance="subtle" icon={<InfoIcon />}
							onClick={() => files.showDetails(selectedItem)}
						/>
					</Tooltip>
				}
			</div>
		</div>
	);
}

const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular);
const InfoIcon = bundleIcon(Info20Filled, Info20Regular);
const NewDirIcon = bundleIcon(FolderAdd20Filled, FolderAdd20Regular);
const NewFileIcon = bundleIcon(DocumentAdd20Filled, DocumentAdd20Regular);

const useStyles = makeStyles({
	toolbar:
	{
		display: "flex",
		gap: tokens.spacingHorizontalS,
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalMNudge}`,
	},
	selectionToolbar:
	{
		display: "flex",
		gap: tokens.spacingHorizontalXS,
		alignItems: "center",
		justifySelf: "flex-end"
	},
	selectionToolbar_actions:
	{
		display: "flex",
		gap: tokens.spacingHorizontalXXS,
		flexWrap: "wrap",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
		backgroundColor: tokens.colorNeutralBackground1,
		borderRadius: tokens.borderRadius2XLarge
	}
});
