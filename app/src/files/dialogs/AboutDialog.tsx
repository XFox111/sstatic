import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Link, makeStyles, Table, TableBody, TableCell, TableHeaderCell, TableRow, tokens, Tooltip } from "@fluentui/react-components";
import { ArrowDownload20Regular, bundleIcon, Copy16Filled, Copy16Regular, Open20Regular } from "@fluentui/react-icons";
import type { DirectoryChild } from "../../api";
import type { DialogProps } from "../../contexts/DialogContext";
import useRuntimeInfo from "../../hooks/useRuntimeInfo";
import { getRelativeTime } from "../../utils";
import useFiles from "../hooks/useFiles";
import { bytesToSize } from "../utils";

export default function AboutDialog({ item, close }: DialogProps<AboutDialogProps>): React.ReactElement
{
	const { filesBaseUrl } = useRuntimeInfo();
	const files = useFiles();

	const cls = useStyles();

	return (
		<DialogSurface>
			<DialogBody>
				<DialogTitle>About file</DialogTitle>
				<DialogContent>
					<Table className={cls.table} size="extra-small">
						<TableBody>
							<TableRow>
								<TableHeaderCell>Name</TableHeaderCell>
								<TableCell>{item.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableHeaderCell>Type</TableHeaderCell>
								<TableCell>{item.type === "file" ? "File" : "Folder"}</TableCell>
							</TableRow>
							<TableRow>
								<TableHeaderCell>Location</TableHeaderCell>
								<TableCell>{item.path}</TableCell>
							</TableRow>
							{item.type === "file" &&
								<>
									<TableRow>
										<TableHeaderCell>File type</TableHeaderCell>
										<TableCell>{item.mime}</TableCell>
									</TableRow>
									<TableRow>
										<TableHeaderCell>Size</TableHeaderCell>
										<TableCell>
											{item.size > 1024
												? `${bytesToSize(item.size)} (${item.size} Bytes)`
												: `${item.size} Bytes`
											}
										</TableCell>
									</TableRow>
								</>
							}
							{/* FIXME: https://github.com/dotnet/runtime/pull/132144 */}
							{/* <TableRow>
								<TableHeaderCell>Created</TableHeaderCell>
								<TableCell>
									{new Date(item.createdAt).toLocaleString()} ({getRelativeTime(item.createdAt)})
								</TableCell>
							</TableRow> */}
							<TableRow>
								<TableHeaderCell>Updated</TableHeaderCell>
								<TableCell>
									{new Date(item.updatedAt).toLocaleString()} ({getRelativeTime(item.updatedAt)})
								</TableCell>
							</TableRow>
							{item.type === "file" &&
								<TableRow>
									<TableHeaderCell>Static link</TableHeaderCell>
									<TableCell className={cls.linkCell}>
										<Link href={files.getUrl(item)} target="_blank">
											{filesBaseUrl}{item.path}
										</Link>
										<Tooltip relationship="label" content="Copy link">
											<Button appearance="subtle" size="small" icon={<CopyIconSmall />}
												onClick={() => files.copyUrl(item)}
											/>
										</Tooltip>
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</DialogContent>
				<DialogActions>
					{item.type === "file" &&
						<>
							<Tooltip relationship="label" content="Download">
								<Button appearance="subtle" icon={<ArrowDownload20Regular />}
									as="a" href={files.getUrl(item, true)} target="_blank"
								/>
							</Tooltip>
							<Button icon={<Open20Regular />}
								as="a" href={files.getUrl(item)} target="_blank"
							>
								Open file
							</Button>
						</>
					}
					<Button appearance="primary" onClick={() => close()}>
						Close
					</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	table:
	{
		"& th":
		{
			width: "100px",
			fontWeight: tokens.fontWeightSemibold
		}
	},
	linkCell:
	{
		minHeight: "32px",
		display: "flex",
		gap: tokens.spacingHorizontalXS,
		alignItems: "center"
	}
});

const CopyIconSmall = bundleIcon(Copy16Filled, Copy16Regular);

export type AboutDialogProps =
	{
		item: DirectoryChild;
	};
