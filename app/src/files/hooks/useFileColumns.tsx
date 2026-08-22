import { Button, createTableColumn, Link, makeStyles, Menu, MenuDivider, MenuItem, MenuItemLink, MenuList, MenuPopover, MenuTrigger, TableCellActions, TableCellLayout, tokens, Tooltip, type TableColumnDefinition } from "@fluentui/react-components";
import { ArrowDownload20Regular, bundleIcon, ClipboardLink20Filled, ClipboardLink20Regular, Cut20Regular, Delete20Filled, Delete20Regular, Document16Regular, DocumentEdit20Filled, DocumentEdit20Regular, Eye20Filled, Eye20Regular, Folder20Filled, Info20Filled, Info20Regular, LinkAdd20Regular, MoreHorizontal20Regular, Rename20Filled, Rename20Regular } from "@fluentui/react-icons";
import type { DirectoryChild } from "../../api";
import { useDangerStyles } from "../../hooks/useDangerStyles";
import { getRelativeTime } from "../../utils";
import bytesToSize from "../utils/bytesToSize";
import useCurrentFolder from "./useCurrentFolder";
import useFiles from "./useFiles";

export default function useFileColumns(): TableColumnDefinition<DirectoryChild>[]
{
	const files = useFiles();
	const { cut } = useCurrentFolder();
	const cls = useStyles();
	const dangerCls = useDangerStyles();

	return [
		createTableColumn({
			columnId: "name",
			renderHeaderCell: () => <TableCellLayout media={<Document16Regular />}>Name</TableCellLayout>,
			renderCell: item => <>
				<TableCellLayout
					media={
						item.type === "directory"
							? <Folder20Filled className={cls.folderIcon} />
							: <Document16Regular />
					}
				>
					{item.type === "file" ?
						<Link className={cls.nameLink} href={files.getUrl(item)} target="_blank">
							{item.name}
						</Link>
						:
						<Link className={cls.nameLink} onClick={() => files.setCurrentFolder(item)}>
							{item.name}
						</Link>
					}
				</TableCellLayout>
				<TableCellActions>
					{item.type === "file" &&
						<Tooltip relationship="label" content="Copy link">
							<Button appearance="subtle" icon={<CopyIcon />} onClick={() => files.copyUrl(item)} />
						</Tooltip>
					}
					<Menu hasIcons>
						<MenuTrigger>
							<Tooltip relationship="label" content="More">
								<Button appearance="subtle" icon={<MoreHorizontal20Regular />} />
							</Tooltip>
						</MenuTrigger>
						<MenuPopover>
							<MenuList>
								{item.type === "file" &&
									<>
										<MenuItem icon={<CopyIcon />} onClick={() => files.copyUrl(item)}>
											Copy link
										</MenuItem>
										<MenuItem icon={<LinkAdd20Regular />} onClick={() => files.createShortLink(item)}>
											Create short link
										</MenuItem>
										<MenuDivider />
										<MenuItemLink href={files.getUrl(item)} target="_blank" icon={<ViewIcon />}>
											View in new tab
										</MenuItemLink>
										<MenuItem icon={<EditIcon />} onClick={() => files.showEditor(item)}>
											Open in text editor
										</MenuItem>
										<MenuDivider />
										<MenuItemLink icon={<ArrowDownload20Regular />}
											href={files.getUrl(item, true)} target="_blank"
										>
											Download
										</MenuItemLink>
									</>
								}
								<MenuItem icon={<RenameIcon />} onClick={() => files.renameItem(item)}>
									Rename
								</MenuItem>
								<MenuItem icon={<Cut20Regular />} onClick={() => cut(item)}>
									Cut
								</MenuItem>
								<MenuItem className={dangerCls.menuItem} icon={<DeleteIcon />}
									onClick={() => files.deleteItems(item)}
								>
									Delete
								</MenuItem>
								<MenuDivider />
								<MenuItem icon={<InfoIcon />} onClick={() => files.showDetails(item)}>
									About
								</MenuItem>
							</MenuList>
						</MenuPopover>
					</Menu>
				</TableCellActions>
			</>
		}),
		createTableColumn({
			columnId: "updatedAt",
			renderHeaderCell: () => "Modified",
			renderCell: item => (
				<Tooltip relationship="description" content={new Date(item.updatedAt).toLocaleString()}>
					<span>{getRelativeTime(item.updatedAt)}</span>
				</Tooltip>
			)
		}),
		createTableColumn({
			columnId: "size",
			renderHeaderCell: () => "File size",
			renderCell: item => item.type === "file" ? bytesToSize(item.size) : ""
		})
	];
}

const useStyles = makeStyles({
	nameLink:
	{
		color: tokens.colorNeutralForeground1 + " !important"
	},
	folderIcon:
	{
		color: tokens.colorPaletteMarigoldForeground1
	}
});

const CopyIcon = bundleIcon(ClipboardLink20Filled, ClipboardLink20Regular);
const RenameIcon = bundleIcon(Rename20Filled, Rename20Regular);
const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular);
const EditIcon = bundleIcon(DocumentEdit20Filled, DocumentEdit20Regular);
const InfoIcon = bundleIcon(Info20Filled, Info20Regular);
const ViewIcon = bundleIcon(Eye20Filled, Eye20Regular);
