import { DataGridRow, makeStyles, mergeClasses, useMergedRefs, type DataGridRowProps } from "@fluentui/react-components";
import type { DirectoryChild } from "../../api";
import useCurrentFolder from "../hooks/useCurrentFolder";
import useDraggableFile from "../hooks/useDraggableFiles";
import useFileDropzone from "../hooks/useFileDropzone";
import useFiles from "../hooks/useFiles";

export default function FileRow({ item, className, children }: FileRowProps): React.ReactElement
{
	const { setCurrentFolder, getUrl } = useFiles();
	const { cutItems } = useCurrentFolder();
	const { ref: dragRef } = useDraggableFile<HTMLDivElement>(item);
	const { ref: dropRef, className: dropzoneClassName } = useFileDropzone<HTMLDivElement>(item.type === "directory" ? item : undefined);
	const isCut: boolean = cutItems?.items.some(i => i.path === item.path) ?? false;
	const cls = useStyles();

	return (
		<DataGridRow<DirectoryChild>
			// @ts-expect-error Invalid ref type
			draggable ref={useMergedRefs(dragRef, dropRef)}
			className={mergeClasses(isCut && cls.cutRow, dropzoneClassName, className && className)}
			data-path={item.path}
			onDoubleClick={() =>
			{
				if (item.type === "directory")
					setCurrentFolder(item);
				else
					window.open(getUrl(item), "_blank");
			}}
		>
			{children}
		</DataGridRow>
	);
}

const useStyles = makeStyles({
	cutRow:
	{
		opacity: .5
	}
});

export type FileRowProps =
	{
		item: DirectoryChild;
		className?: string;
		children: DataGridRowProps<DirectoryChild>["children"];
	};
