import { makeStyles, mergeClasses, Toast, ToastBody, ToastTitle, tokens, useToastController } from "@fluentui/react-components";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DirectoryDetails } from "../../api";
import FileDndContext, { type DndProviderContext } from "../contexts/FileDndContext";
import { draggingFiles } from "../utils";
import useFiles from "./useFiles";

export default function useFileDropzone<T extends HTMLElement>(folder?: DirectoryDetails): UseFileDropzoneHook<T>
{
	const { isDragging, currentItems } = useContext<DndProviderContext>(FileDndContext);
	const toaster = useToastController();
	const { currentFolder, moveItems, uploadFiles } = useFiles();
	const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
	const ref: React.Ref<T> = useRef<T>(null);
	const disabled: boolean = useMemo(
		() =>
			folder === undefined ||
			(
				currentItems !== null && currentItems.length > 0 &&
				(
					(folder.path.startsWith(currentItems[0].path) && currentItems.some(i => i.type === "directory")) ||
					(currentItems[0].path.startsWith(folder.path) && !currentItems[0].path.substring(folder.path.length + 1).includes("/")) ||
					(currentItems.some(i => i.path === folder.path)) ||
					folder.path === currentFolder.path
				)
			),
		[currentItems, folder, currentFolder]
	);

	const cls = useDropzoneStyles();

	const onDragEnterHandler = useCallback((event: DragEvent): void =>
	{
		if (!currentItems && !draggingFiles(event))
			return;

		event.preventDefault();
		setIsDraggingOver(true);

		if (draggingFiles(event))
			event.dataTransfer!.dropEffect = "copy";
	}, [currentItems]);

	const onDragLeaveHandler = useCallback((): void =>
	{
		setIsDraggingOver(false);
	}, []);

	const onDragOverHandler = useCallback((event: DragEvent): void =>
	{
		setIsDraggingOver(true);
		event.preventDefault();
		event.stopPropagation();
	}, []);

	const onDropHandler = useCallback((event: DragEvent): void =>
	{
		event.preventDefault();
		setIsDraggingOver(false);

		if (!folder)
			return;

		if (currentItems)
			moveItems({ items: currentItems, parent: currentFolder }, folder);
		else if (draggingFiles(event))
		{
			if ([...event.dataTransfer!.items].some(item => item.webkitGetAsEntry()?.isFile === false))
			{
				toaster.dispatchToast(
					<Toast>
						<ToastTitle>Cannot upload folders</ToastTitle>
						<ToastBody>Uploading folders is not supported. Please select files only.</ToastBody>
					</Toast>,
					{ intent: "error" }
				);
				return;
			}

			uploadFiles(folder, event.dataTransfer!.files);
		}
	}, [toaster, currentFolder, currentItems, folder, moveItems, uploadFiles]);

	useEffect(() =>
	{
		const element: T | null = ref.current;

		if (element !== null && !disabled)
		{
			element.addEventListener("dragenter", onDragEnterHandler);
			element.addEventListener("dragleave", onDragLeaveHandler);
			element.addEventListener("dragover", onDragOverHandler);
			element.addEventListener("drop", onDropHandler);
		}

		return () =>
		{
			element?.removeEventListener("dragenter", onDragEnterHandler);
			element?.removeEventListener("dragleave", onDragLeaveHandler);
			element?.removeEventListener("dragover", onDragOverHandler);
			element?.removeEventListener("drop", onDropHandler);
		};
	}, [ref, disabled, onDropHandler, onDragEnterHandler, onDragLeaveHandler, onDragOverHandler]);

	if (disabled)
		return ({ isDragging: false, isDraggingOver: false, ref, className: "" });

	return ({
		isDragging, isDraggingOver, ref,
		className: mergeClasses("sstatic-FileDropZone", cls.default, isDragging && cls.active, isDraggingOver && cls.over)
	});
}

const useDropzoneStyles = makeStyles({
	default:
	{
		pointerEvents: "auto"
	},
	active:
	{
		border: `${tokens.strokeWidthThin} dashed ${tokens.colorBrandStroke1}`,

		"& > *":
		{
			pointerEvents: "none"
		}
	},
	over:
	{
		border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandStroke1}`,
		backgroundColor: tokens.colorBrandBackground2,

		"& > *":
		{
			pointerEvents: "none"
		}
	}
});

export type UseFileDropzoneHook<T extends HTMLElement> =
	{
		isDragging: boolean;
		isDraggingOver: boolean;
		ref: React.Ref<T>;
		className: string;
	};
