import { type TreeItemOpenChangeData, Spinner, Tree, TreeItem, TreeItemLayout, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { Folder20Regular, FolderOpen20Filled } from "@fluentui/react-icons";
import { useMemo, useState } from "react";
import { type DirectoryDetails } from "../../api";
import useFileDropzone from "../hooks/useFileDropzone";
import useFiles from "../hooks/useFiles";

export default function FolderTreeItem({ folder }: FolderTreeItemProps): React.ReactElement
{
	const { currentFolder, fetchChildren, setCurrentFolder } = useFiles();
	const { ref, className: dropzoneClassName } = useFileDropzone<HTMLDivElement>(folder);

	const [isLoading, setLoading] = useState<boolean>(false);
	const isEmpty = useMemo(() => folder.children?.filter(i => i.type === "directory").length === 0, [folder.children]);

	const cls = useStyles();

	async function onOpenChange(_: unknown, data: TreeItemOpenChangeData): Promise<void>
	{
		let loadedFolder: DirectoryDetails = folder;

		if (!loadedFolder.children)
		{
			setLoading(true);
			loadedFolder = await fetchChildren(loadedFolder);
			setLoading(false);
		}

		if (data.value !== folder.path)
			return;

		if ((data.type === "Click" || data.type === "Enter") && folder.path !== currentFolder.path)
			setCurrentFolder(loadedFolder);
	}

	return (
		<TreeItem key={folder.path}
			itemType={isEmpty ? "leaf" : "branch"}
			value={folder.path}
			onOpenChange={onOpenChange}
			onClick={isEmpty ? () => setCurrentFolder(folder) : undefined}
		>
			<TreeItemLayout
				ref={ref}
				className={mergeClasses(cls.item, dropzoneClassName)}
				iconBefore={
					folder.path === currentFolder.path
						? <FolderOpen20Filled className={cls.folderIcon} />
						: <Folder20Regular className={cls.folderIcon} />
				}
				iconAfter={isLoading ? <Spinner size="extra-tiny" /> : undefined}
			>
				{folder.name}
			</TreeItemLayout>
			{folder.children &&
				<Tree>
					{folder.children.filter(i => i.type === "directory").map(item =>
						<FolderTreeItem key={item.path} folder={item as DirectoryDetails} />
					)}
				</Tree>
			}
		</TreeItem>
	);
}

const useStyles = makeStyles({
	folderIcon:
	{
		color: tokens.colorPaletteMarigoldForeground1
	},
	item:
	{
		borderRadius: tokens.borderRadius2XLarge
	}
});

export type FolderTreeItemProps =
	{
		folder: DirectoryDetails;
	};
