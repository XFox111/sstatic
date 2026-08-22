import { Badge, Button, InteractionTag, InteractionTagPrimary, Link, mergeClasses, Popover, PopoverSurface, PopoverTrigger, Spinner, Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableRow, Text, Tooltip, useToastController } from "@fluentui/react-components";
import { ArrowRouting20Regular, bundleIcon, Clock20Regular, Copy16Filled, Copy16Regular, Delete20Filled, Delete20Regular, Edit20Filled, Edit20Regular, Eye20Regular, Info20Filled, Info20Regular, Link20Regular, WeatherDuststorm48Regular } from "@fluentui/react-icons";
import { useMemo } from "react";
import type { ShortLink } from "../../api/links";
import type { Tag } from "../../api/tags";
import UrlCopiedToast from "../../components/UrlCopiedToast";
import { useDangerStyles } from "../../hooks/useDangerStyles";
import useMediaQuery from "../../hooks/useMediaQuery";
import { getRelativeTime } from "../../utils";
import useShortener from "../hooks/useShortener";
import applyFilters, { type ShortenerFilters } from "../utils/applyFilters";
import { getForegroundColor } from "../utils/color";
import { useStyles_LinksTable } from "./LinksTable.styles";

export default function LinksTable({ filters, onFilterUpdated }: LinksTableProps): React.ReactElement
{
	const { links, isLoading, editLink, deleteLink, getUrl } = useShortener();
	const toaster = useToastController();
	const filteredLinks: ShortLink[] = useMemo(() => applyFilters(links, filters), [links, filters]);

	const hideTimeAndVisits = useMediaQuery("(max-width: 1280px)");
	const hideTagsColumn = useMediaQuery("(max-width: 1024px)");
	const hideRedirectColumn = useMediaQuery("(max-width: 768px)");
	const hideStatusColumn = useMediaQuery("(max-width: 480px)");

	const cls = useStyles_LinksTable();
	const dangerCls = useDangerStyles();

	function addTagToFilter(tag: Tag): void
	{
		if (filters.tags.every(i => i.id !== tag.id))
			onFilterUpdated({ ...filters, tags: [...filters.tags, tag] });
	}

	function copyUrl(url: string): void
	{
		navigator.clipboard.writeText(url);
		toaster.dispatchToast(<UrlCopiedToast />, { intent: "success" });
	};

	const renderUrlCellContent = (url: string, href: string): React.ReactElement => (
		<>
			<Link href={href} target="_blank" title={url}>
				{url}
			</Link>
			<Tooltip relationship="label" content="Copy URL">
				<Button size="small" appearance="subtle" icon={<CopyIconSmall />}
					onClick={() => copyUrl(href)}
				/>
			</Tooltip>
		</>
	);

	if (isLoading)
		return <Spinner className={cls.spinner} />;

	if (filteredLinks.length < 1)
		return (
			<div className={cls.empty}>
				<WeatherDuststorm48Regular />
				<Text>Nothing to show here yet</Text>
			</div>
		);

	return (
		<Table>
			<TableHeader className={cls.tableHeader}>
				<TableRow>
					<TableHeaderCell>Short URL</TableHeaderCell>
					<TableHeaderCell className={mergeClasses(hideRedirectColumn && cls.hidden)}>
						Redirects to
					</TableHeaderCell>
					<TableHeaderCell
						className={mergeClasses(cls.statusHeader, hideStatusColumn && cls.hidden)}
						button={{ className: cls.statusCell }}
					>
						Status
					</TableHeaderCell>
					<TableHeaderCell className={mergeClasses(cls.timeHeader, hideTimeAndVisits && cls.hidden)}>
						Last updated
					</TableHeaderCell>
					<TableHeaderCell className={mergeClasses(cls.tagsHeader, hideTagsColumn && cls.hidden)}>
						Tags
					</TableHeaderCell>
					<TableHeaderCell className={mergeClasses(cls.visitsHeader, hideTimeAndVisits && cls.hidden)}>
						Visits
					</TableHeaderCell>
					<TableHeaderCell className={hideTimeAndVisits ? cls.actionsHeaderExpanded : cls.actionsHeader} />
				</TableRow>
			</TableHeader>
			<TableBody>
				{filteredLinks.map(link =>
					<TableRow key={link.slug}>
						<TableCell>
							<TableCellLayout media={<Link20Regular />} className={cls.urlCell}>
								{link.slug === "_catch-all"
									? <Text>Catch-all redirect</Text>
									: renderUrlCellContent(getUrl(link), getUrl(link, true))
								}
							</TableCellLayout>
						</TableCell>
						<TableCell className={mergeClasses(cls.urlCell, hideRedirectColumn && cls.hidden)}>
							<TableCellLayout media={<ArrowRouting20Regular />} className={cls.urlCell}>
								{renderUrlCellContent(link.redirectUrl, link.redirectUrl)}
							</TableCellLayout>
						</TableCell>
						<TableCell className={mergeClasses(hideStatusColumn && cls.hidden)}>
							<TableCellLayout className={cls.statusCell}>
								{link.isEnabled
									? <Badge appearance="tint" color="success">Enabled</Badge>
									: <Badge appearance="tint" color="danger">Disabled</Badge>
								}
							</TableCellLayout>
						</TableCell>
						<TableCell className={mergeClasses(hideTimeAndVisits && cls.hidden)}>
							<Tooltip relationship="description" content={new Date(link.updatedAt).toLocaleString()}>
								<Text>{getRelativeTime(link.updatedAt)}</Text>
							</Tooltip>
						</TableCell>
						<TableCell className={mergeClasses(cls.tagsCell, hideTagsColumn && cls.hidden)}>
							{link.tags.sort((a, b) => a.name.localeCompare(b.name)).map(tag =>
								<InteractionTag shape="circular" size="extra-small" key={tag.id}>
									<InteractionTagPrimary
										onClick={() => addTagToFilter(tag)}
										style={{
											backgroundColor: tag.color,
											color: getForegroundColor(tag.color)
										}}
									>
										{tag.name}
									</InteractionTagPrimary>
								</InteractionTag>
							)}
						</TableCell>
						<TableCell className={mergeClasses(hideTimeAndVisits && cls.hidden)}>
							<TableCellLayout media={<Eye20Regular />}>
								{link.visits.toLocaleString()}
							</TableCellLayout>
						</TableCell>
						<TableCell>
							{hideTimeAndVisits &&
								<Popover withArrow>
									<PopoverTrigger disableButtonEnhancement>
										<Tooltip relationship="label" content="More info">
											<Button appearance="subtle" icon={<InfoIcon />} />
										</Tooltip>
									</PopoverTrigger>

									<PopoverSurface className={cls.popoverSurface}>
										<div className={cls.popoverRow}>
											<Link20Regular />
											{link.slug === "_catch-all"
												? <Text>Catch-all redirect</Text>
												: renderUrlCellContent(getUrl(link), getUrl(link, true))
											}
										</div>
										<div className={cls.popoverRow}>
											<ArrowRouting20Regular />
											{renderUrlCellContent(link.redirectUrl, link.redirectUrl)}
										</div>
										<div className={cls.popoverRow}>
											<Clock20Regular />
											<Tooltip relationship="description" content={new Date(link.updatedAt).toLocaleString()}>
												<Text>{getRelativeTime(link.updatedAt)}</Text>
											</Tooltip>
										</div>
										<div className={cls.popoverRow}>
											<Eye20Regular />
											{link.visits.toLocaleString()}
										</div>
										<div className={cls.tagsContainer}>
											{link.isEnabled
												? <Badge appearance="tint" color="success">Enabled</Badge>
												: <Badge appearance="tint" color="danger">Disabled</Badge>
											}
											{link.tags.sort((a, b) => a.name.localeCompare(b.name)).map(tag =>
												<InteractionTag shape="circular" size="extra-small" key={tag.id}>
													<InteractionTagPrimary
														onClick={() => addTagToFilter(tag)}
														style={{
															backgroundColor: tag.color,
															color: getForegroundColor(tag.color)
														}}
													>
														{tag.name}
													</InteractionTagPrimary>
												</InteractionTag>
											)}
										</div>
									</PopoverSurface>
								</Popover>
							}
							<Tooltip relationship="label" content="Edit">
								<Button
									appearance="subtle" icon={<EditIcon />}
									onClick={() => editLink(link)}
								/>
							</Tooltip>
							<Tooltip relationship="label" content="Delete">
								<Button
									appearance="subtle" icon={<DeleteIcon />}
									className={dangerCls.buttonSubtle}
									onClick={() => deleteLink(link)} />
							</Tooltip>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

const CopyIconSmall = bundleIcon(Copy16Filled, Copy16Regular);
const InfoIcon = bundleIcon(Info20Filled, Info20Regular);
const EditIcon = bundleIcon(Edit20Filled, Edit20Regular);
const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular);

export type LinksTableProps =
	{
		filters: ShortenerFilters;
		onFilterUpdated: (filters: ShortenerFilters) => void;
	};
