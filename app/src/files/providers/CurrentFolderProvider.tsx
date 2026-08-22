import { useEffect, useMemo, useState } from "react";
import type { DirectoryChild } from "../../api";
import CurrentFolderContext from "../contexts/CurrentFolderContext";
import type { SourceItem } from "../contexts/FilesContext";
import useFiles from "../hooks/useFiles";
import { sortFiles, type OrderKey, type SortByKey } from "../utils";

export default function CurrentFolderProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const { currentFolder, setCurrentFolder, moveItems } = useFiles();
	const isLoading = useMemo(() => !currentFolder?.children, [currentFolder]);
	const [cutItems, setCutItems] = useState<SourceItem | null>(null);
	const [selectedItems, setSelectedItems] = useState<DirectoryChild[]>([]);
	const [sortBy, setSortBy] = useState<SortByKey>((localStorage.getItem(SORT_BY_KEY) as SortByKey | null) || "name");
	const [order, setOrder] = useState<OrderKey>((localStorage.getItem(ORDER_KEY) as OrderKey | null) || "asc");
	const items = useMemo(
		() => sortFiles(currentFolder?.children || [], sortBy, order),
		[currentFolder?.children, sortBy, order]
	);

	function cut(...items: DirectoryChild[]): void
	{
		setCutItems({ items, parent: currentFolder });
	}

	function paste(): void
	{
		if (!cutItems)
			return;

		moveItems(cutItems, currentFolder);
		setCutItems(null);
	}

	useEffect(() =>
	{
		setSelectedItems([]);
	}, [currentFolder]);

	useEffect(() =>
	{
		localStorage.setItem("files.sortBy", sortBy);
	}, [sortBy]);

	useEffect(() =>
	{
		localStorage.setItem("files.order", order);
	}, [order]);

	return (
		<CurrentFolderContext.Provider value={{
			isLoading,
			folder: currentFolder, setFolder: setCurrentFolder,
			items,
			selectedItems, setSelectedItems,
			sortBy, setSortBy,
			order, setOrder,
			cutItems, cut, paste
		}}>
			{children}
		</CurrentFolderContext.Provider>
	);
}

const SORT_BY_KEY: string = "files.sortBy";
const ORDER_KEY: string = "files.order";
