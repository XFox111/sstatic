import { Breadcrumb, BreadcrumbDivider, type BreadcrumbProps } from "@fluentui/react-components";
import type { DirectoryDetails } from "../../api";
import useFiles from "../hooks/useFiles";
import { getDirectoriesFromPath } from "../utils";
import PathBreadcrumbItem from "./PathBreadcrumbItem";

export default function PathBreadcrumbs(props: BreadcrumbProps): React.ReactElement
{
	const { rootFolder, currentFolder } = useFiles();
	const directories: DirectoryDetails[] = getDirectoriesFromPath(currentFolder, rootFolder).splice(1);

	return (
		<Breadcrumb size="large" {...props}>
			<PathBreadcrumbItem folder={rootFolder} key={rootFolder.path} />

			{directories.map(folder =>
				<Item folder={folder} key={folder.path} />
			)}
		</Breadcrumb>
	);
}

function Item(props: { folder: DirectoryDetails; }): React.ReactElement
{
	return <>
		<BreadcrumbDivider />
		<PathBreadcrumbItem folder={props.folder} />
	</>;
}
