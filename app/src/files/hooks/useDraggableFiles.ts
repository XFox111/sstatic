import { useCallback, useContext, useEffect, useRef } from "react";
import type { DirectoryChild } from "../../api";
import FileDndContext, { type DndProviderContext } from "../contexts/FileDndContext";

export default function useDraggableFile<T extends HTMLElement>(file: DirectoryChild): UseDraggableFileHook<T>
{
	const { setItem } = useContext<DndProviderContext>(FileDndContext);
	const ref: React.Ref<T> = useRef<T>(null);

	const onDragStartHandler = useCallback((event: DragEvent): void =>
	{
		setItem(file);
		event.dataTransfer!.effectAllowed = "move";
		event.dataTransfer!.setDragImage(document.getElementById("file-drag-preview")!, 0, 0);
		event.stopPropagation();
	}, [file, setItem]);

	const onDragEndHandler = useCallback((): void =>
	{
		setItem(null);
	}, [setItem]);

	useEffect(() =>
	{
		const element: T | null = ref.current;

		element?.addEventListener("dragstart", onDragStartHandler);
		element?.addEventListener("dragend", onDragEndHandler);

		return () =>
		{
			element?.removeEventListener("dragstart", onDragStartHandler);
			element?.removeEventListener("dragend", onDragEndHandler);
		};
	}, [ref, onDragStartHandler, onDragEndHandler]);

	return ({ ref });
}

export type UseDraggableFileHook<T extends HTMLElement> =
	{
		ref: React.Ref<T>;
	};
