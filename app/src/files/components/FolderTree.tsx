import { Tree, type TreeItemOpenChangeData, type TreeItemValue } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import type { DirectoryDetails } from "../../api";
import useFiles from "../hooks/useFiles";
import FolderTreeItem from "./FolderTreeItem";

export default function FolderTree(): React.ReactElement
{
	const { rootFolder, currentFolder } = useFiles();
	const [openItems, setOpenItems] = useState<TreeItemValue[]>([]);

	function onOpenChange(_: unknown, data: TreeItemOpenChangeData): void
	{
		if (data.type === "ExpandIconClick" || data.open)
			setOpenItems([...(data as { openItems?: TreeItemValue[] }).openItems!]);
	}

	useEffect(() =>
	{
		if (currentFolder.path === "" && !currentFolder.children)
		{
			setOpenItems([]);
			return;
		}

		const requiredPaths: string[] = currentFolder.path.split("/").reduce<string[]>((acc, val) =>
		{
			const lastValue = acc.length > 0 ? acc[acc.length - 1] + "/" : "";
			return [...acc, lastValue + val];
		}, []);

		setOpenItems(current => [
			...(currentFolder.children
				? current
				: current.filter(i => !(i as string).startsWith(currentFolder.path) || i === currentFolder.path)
			),
			...requiredPaths.filter(p => !current.some(i => i === p))
		]);

	}, [currentFolder]);

	return (
		<Tree aria-label="Folder tree"
			openItems={openItems}
			onOpenChange={onOpenChange}
		>
			{rootFolder.children!.filter(i => i.type === "directory").map(item =>
				<FolderTreeItem key={item.path} folder={item as DirectoryDetails} />
			)}
		</Tree>
	);
}
