import { DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, mergeClasses, Spinner, Text, type OnSelectionChangeData, type SelectionItemId } from "@fluentui/react-components";
import { WeatherDuststorm48Regular } from "@fluentui/react-icons";
import type { DirectoryChild } from "../api";
import FileRow from "./components/FileRow";
import FileTreeDrawer from "./components/FileTreeDrawer";
import FolderToolbar from "./components/FolderToolbar";
import PathBreadcrumbs from "./components/PathBreadcrumbs";
import { useStyles_FolderView } from "./FolderView.styles";
import useCurrentFolder from "./hooks/useCurrentFolder";
import useFileColumns from "./hooks/useFileColumns";
import useFileDropzone from "./hooks/useFileDropzone";
import useFiles from "./hooks/useFiles";

export default function FolderView({ showTreeDrawer, ...props }: FolderViewProps): React.ReactElement
{
	const { folder, isLoading, items, selectedItems, setSelectedItems } = useCurrentFolder();
	const { isLoading: isRootLoading } = useFiles();
	const { ref, className: dropzoneClassName} = useFileDropzone<HTMLDivElement>(folder);
	const columns = useFileColumns();

	const cls = useStyles_FolderView();

	function onSelectionChange(
		event: React.MouseEvent<Element, globalThis.MouseEvent> | React.KeyboardEvent<Element>,
		data: OnSelectionChangeData
	): void
	{
		const selectedIds: SelectionItemId[] = [...data.selectedItems];
		const selectedItemPath: string = event.currentTarget.getAttribute("data-path")!;

		if (event.target instanceof HTMLInputElement === true || (event.ctrlKey && !event.shiftKey))
			setSelectedItems(selectedIds.map(id => items.find(i => i.path === id)!));
		else if (event.shiftKey && data.selectedItems.size > 1)
		{
			const previousItemPath: string = selectedIds[selectedIds.length - 1] === selectedItemPath
				? selectedIds[selectedIds.length - 2] as string
				: selectedIds[selectedIds.length - 1] as string;
			const previousItemIndex: number = items.findIndex(i => i.path === previousItemPath);
			const currentItemIndex: number = items.findIndex(i => i.path === selectedItemPath);

			const range: DirectoryChild[] = previousItemIndex <= currentItemIndex
				? items.slice(previousItemIndex, currentItemIndex + 1)
				: items.slice(currentItemIndex, previousItemIndex + 1).reverse();

			setSelectedItems(event.ctrlKey
				? [
					...items.filter(i => data.selectedItems.has(i.path)),
					...range.filter(i => !data.selectedItems.has(i.path))
				]
				: range
			);
		}
		else
			setSelectedItems([items.find(i => i.path === selectedItemPath)!]);
	}

	return (
		<article {...props} className={mergeClasses(cls.article, props.className)}>
			<header className={cls.header}>
				<div className={cls.navigation}>
					{showTreeDrawer && <FileTreeDrawer />}
					{!isRootLoading && <PathBreadcrumbs className={cls.breadcrumbs} />}
				</div>

				<FolderToolbar />
			</header>
			<div ref={ref} className={mergeClasses(cls.content, dropzoneClassName)}>
				{isLoading ?
					<div className={cls.emptyContainer}>
						<Spinner size="large" />
					</div>
					:
					folder.children!.length < 1 ?
						<div className={cls.emptyContainer}>
							<WeatherDuststorm48Regular />
							<Text>Folder is empty</Text>
						</div>
						:
						<DataGrid
							items={items}
							columns={columns}
							selectionMode="multiselect"
							selectionAppearance="neutral"
							selectedItems={selectedItems.map(i => i.path)}
							onSelectionChange={onSelectionChange}
							getRowId={item => item.path}
						>
							<DataGridHeader className={cls.tableHeader}>
								<DataGridRow className={cls.row}>
									{({ renderHeaderCell }) =>
										<DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
									}
								</DataGridRow>
							</DataGridHeader>
							<DataGridBody<DirectoryChild>>
								{rowData =>
									<FileRow key={rowData.rowId} item={rowData.item} className={cls.row}>
										{({ renderCell }) =>
											<DataGridCell>{renderCell(rowData.item)}</DataGridCell>
										}
									</FileRow>
								}
							</DataGridBody>
						</DataGrid>
				}
			</div>
		</article>
	);
}

export type FolderViewProps = React.HTMLAttributes<HTMLElement> &
{
	showTreeDrawer?: boolean;
};
