import { Body1, makeStyles, tokens } from "@fluentui/react-components";
import { Document24Regular, DocumentFolder24Regular, Folder24Filled } from "@fluentui/react-icons";
import type { DirectoryChild } from "../../api";

export default function FileDragPreview({ files }: { files: DirectoryChild[] | null; }): React.ReactElement
{
	const cls = useStyles();

	if ((files?.length ?? 0) > 1)
		return (
			<div id="file-drag-preview" className={cls.dragPreview}>
				<DocumentFolder24Regular />
				<Body1>({files!.length}) multiple files</Body1>
			</div>
		);

	const file: DirectoryChild | null = files ? files[0] : null;

	return (
		<div id="file-drag-preview" className={cls.dragPreview}>
			{file?.type === "directory"
				? <Folder24Filled className={cls.folderIcon} />
				: <Document24Regular />
			}
			<Body1>{file?.name}</Body1>
		</div>
	);
}

const useStyles = makeStyles({
	dragPreview:
	{
		backgroundColor: tokens.colorNeutralBackgroundInverted,
		color: tokens.colorNeutralForegroundInverted,
		borderRadius: tokens.borderRadius2XLarge,
		display: "flex",
		gap: tokens.spacingVerticalS,
		alignItems: "center",
		padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,

		position: "absolute",
		top: "-1000px",
		left: 0,
		pointerEvents: "none"
	},
	folderIcon:
	{
		color: tokens.colorPaletteMarigoldForeground1
	}
});
