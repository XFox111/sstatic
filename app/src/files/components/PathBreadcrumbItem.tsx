import { BreadcrumbButton, BreadcrumbItem, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { Folder20Regular, FolderOpen20Filled } from "@fluentui/react-icons";
import type { DirectoryDetails } from "../../api";
import useFileDropzone from "../hooks/useFileDropzone";
import useFiles from "../hooks/useFiles";

export default function PathBreadcrumbItem({ folder: directory }: PathBreadcrumbItemProps): React.ReactElement
{
	const { rootFolder, currentFolder, setCurrentFolder } = useFiles();
	const { ref, className: dropzoneClassName } = useFileDropzone<HTMLButtonElement>(directory);
	const current = currentFolder.path === directory.path;
	const isRoot = directory.path === rootFolder.path;
	const cls = useStyles();

	return (
		<BreadcrumbItem>
			<BreadcrumbButton
				ref={ref}
				className={mergeClasses(cls.button, dropzoneClassName)}
				onClick={() => setCurrentFolder(directory)}
				current={current}
				icon={
					isRoot
						? current ? <FolderOpen20Filled /> : <Folder20Regular />
						: undefined
				}
			>
				{isRoot ? "Files" : directory.name}
			</BreadcrumbButton>
		</BreadcrumbItem>
	);
}

const useStyles = makeStyles({
	button:
	{
		borderRadius: tokens.borderRadius2XLarge,

		"& svg":
		{
			color: tokens.colorPaletteMarigoldForeground1
		}
	}
});

export type PathBreadcrumbItemProps =
	{
		folder: DirectoryDetails;
	};
