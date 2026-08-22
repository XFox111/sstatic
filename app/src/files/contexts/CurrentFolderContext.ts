import { createContext } from "react";
import type { DirectoryChild, DirectoryDetails } from "../../api";
import type { OrderKey, SortByKey } from "../utils";
import type { SourceItem } from "./FilesContext";

export default createContext<CurrentFolderContextType>(null!);

export type CurrentFolderContextType =
	{
		isLoading: boolean;
		folder: DirectoryDetails;
		setFolder: (folder: DirectoryDetails) => void;
		items: DirectoryChild[];
		cutItems: SourceItem | null;
		selectedItems: DirectoryChild[];
		setSelectedItems(items: DirectoryChild[]): void;
		sortBy: SortByKey;
		order: OrderKey;
		setSortBy(sortBy: SortByKey): void;
		setOrder(order: OrderKey): void;
		cut(...items: DirectoryChild[]): void;
		paste(): void;
	};
