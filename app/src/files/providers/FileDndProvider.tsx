import { useEffect, useState } from "react";
import type { DirectoryChild } from "../../api";
import FileDragPreview from "../components/FileDragPreview";
import FileDndContext from "../contexts/FileDndContext";
import { draggingFiles as hasFiles } from "../utils";

export default function FileDndProvider({ children, onDragStart }: FileDndProviderProps): React.ReactElement
{
	const [currentItems, setCurrentItems] = useState<DirectoryChild[] | null>(null);
	const [draggingFiles, setDraggingFiles] = useState<boolean>(false);
	const isDragging = currentItems !== null || draggingFiles;

	function setItem(item: DirectoryChild | null): void
	{
		setCurrentItems(item === null ? null
			: (onDragStart?.(item) ?? [item])
		);
	}

	useEffect(() =>
	{
		let counter: number = 0;

		function onDropHandler(event: DragEvent): void
		{
			if (!hasFiles(event))
				return;

			event.preventDefault();
			counter = 0;
			setDraggingFiles(false);
		};

		function onDragOverHandler(event: DragEvent): void
		{
			event.preventDefault();
			event.dataTransfer!.dropEffect = "none";
		};

		function onDragEnterHandler(event: DragEvent): void
		{
			if (!hasFiles(event))
				return;

			counter++;
			setDraggingFiles(true);
		};

		function onDragLeaveHandler(event: DragEvent): void
		{
			if (!hasFiles(event))
				return;

			counter--;

			if (counter < 1)
			{
				counter = 0;
				setDraggingFiles(false);
			}
		};

		window.addEventListener("drop", onDropHandler);
		window.addEventListener("dragover", onDragOverHandler);
		window.addEventListener("dragenter", onDragEnterHandler);
		window.addEventListener("dragleave", onDragLeaveHandler);

		return () =>
		{
			window.removeEventListener("drop", onDropHandler);
			window.removeEventListener("dragover", onDragOverHandler);
			window.removeEventListener("dragenter", onDragEnterHandler);
			window.removeEventListener("dragleave", onDragLeaveHandler);
		};
	}, []);

	return (
		<FileDndContext.Provider value={{ isDragging, setItem, currentItems }}>
			{children}

			<FileDragPreview files={currentItems} />
		</FileDndContext.Provider>
	);
}

export type FileDndProviderProps = React.PropsWithChildren &
{
	onDragStart?: (item: DirectoryChild) => DirectoryChild[];
};
