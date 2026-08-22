import { createContext } from "react";
import type { DirectoryChild } from "../../api";

export default createContext<DndProviderContext>({ isDragging: false, setItem: () => { }, currentItems: null });

export type DndProviderContext =
	{
		isDragging: boolean;
		setItem(item: DirectoryChild | null): void;
		currentItems: DirectoryChild[] | null;
	};
