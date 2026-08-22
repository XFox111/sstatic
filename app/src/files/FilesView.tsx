import { MessageBar, MessageBarBody } from "@fluentui/react-components";
import { useEffect } from "react";
import { type DirectoryChild } from "../api";
import DialogRenderer from "../components/DialogRenderer";
import useMediaQuery from "../hooks/useMediaQuery";
import FolderTree from "./components/FolderTree";
import { useStyles_FilesView } from "./FilesView.styles";
import FolderView from "./FolderView";
import useCurrentFolder from "./hooks/useCurrentFolder";
import useFiles from "./hooks/useFiles";
import FileDndProvider from "./providers/FileDndProvider";
import FilesProvider from "./providers/FilesProvider";

function FilesView(): React.ReactElement
{
	const { isLoading, error, rootFolder } = useFiles();
	const { selectedItems, setSelectedItems } = useCurrentFolder();

	const hideTree: boolean = useMediaQuery("(max-width: 1024px)");

	const cls = useStyles_FilesView();

	function onDragStart(item: DirectoryChild): DirectoryChild[]
	{
		if (selectedItems.some(i => i.path === item.path))
			return selectedItems;

		setSelectedItems([item]);
		return [item];
	};

	useEffect(() =>
	{
		document.title = "Static files - sstatic";
	}, []);

	return (
		<FileDndProvider onDragStart={onDragStart}>
			<div className={cls.root}>
				{error &&
					<MessageBar intent="error" className={cls.errorBar}>
						<MessageBarBody>{error}</MessageBarBody>
					</MessageBar>
				}

				<div className={cls.columnWrap}>
					{!isLoading && rootFolder.children!.filter(i => i.type === "directory").length > 0 && !hideTree &&
						<aside className={cls.sidebar}>
							<FolderTree />
						</aside>
					}
					<FolderView showTreeDrawer={hideTree} />
				</div>
			</div>
			<DialogRenderer />
		</FileDndProvider>
	);
}

export default function FilesViewWrapper(): React.ReactElement
{
	return (
		<FilesProvider>
			<FilesView />
		</FilesProvider>
	);
}
