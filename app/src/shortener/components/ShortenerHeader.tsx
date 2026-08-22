import { Button, Dropdown, mergeClasses, Option, Tooltip, type OptionOnSelectData, type SelectionEvents } from "@fluentui/react-components";
import { Add20Regular, ArrowClockwise20Regular, FilterDismiss20Regular, Tag20Regular } from "@fluentui/react-icons";
import { useMemo } from "react";
import type { Tag } from "../../api/tags";
import useDialog from "../../hooks/useDialog";
import ManageTagsDialog from "../dialogs/ManageTagsDialog";
import useShortener from "../hooks/useShortener";
import type { ShortenerFilters, StateFilter } from "../utils/applyFilters";
import { useStyles_ShortenerHeader } from "./ShortenerHeader.styles";
import TagInput from "./TagInput";

export default function ShortenerHeader({ filters: filter, onFilterUpdated }: ShortenerHeaderProps): React.ReactElement
{
	const { isLoading, refresh, createLink } = useShortener();
	const dialog = useDialog();
	const stateFilterText: string = useMemo(() => stateFilterOptions[filter.state], [filter.state]);

	const cls = useStyles_ShortenerHeader();

	function openTagsDialog(): void
	{
		dialog.pushCustom(ManageTagsDialog, {}, "alert");
	}

	function onFilterSelect(_: SelectionEvents, data: OptionOnSelectData): void
	{
		const newValue: StateFilter = data.optionValue as StateFilter;
		onFilterUpdated({ ...filter, state: newValue });
	}

	function onTagSelect(newTags: Tag[]): void
	{
		onFilterUpdated({ ...filter, tags: newTags });
	}

	function resetFilters(): void
	{
		onFilterUpdated({ state: "all", tags: [] });
	}

	return (
		<header className={cls.header}>
			<div className={cls.filters}>
				<TagInput className={cls.filterField} disabled={isLoading} selectedTags={filter.tags} onChange={onTagSelect} />

				<div className={cls.filterGroup}>
					<Dropdown className={mergeClasses(cls.stateFilter, cls.filterField)}
						disabled={isLoading}
						value={stateFilterText}
						selectedOptions={[filter.state]}
						onOptionSelect={onFilterSelect}
					>
						{Object.entries(stateFilterOptions).map(([value, text]) => (
							<Option key={value} value={value}>{text}</Option>
						))}
					</Dropdown>

					<Tooltip relationship="label" content="Reset filters">
						<Button
							appearance="subtle"
							icon={<FilterDismiss20Regular />}
							onClick={resetFilters}
							disabled={isLoading || (filter.tags.length < 1 && filter.state === "all")}
						/>
					</Tooltip>
				</div>
			</div>

			<div className={cls.actions}>
				<Tooltip relationship="label" content="Refresh">
					<Button appearance="subtle" icon={<ArrowClockwise20Regular />} onClick={refresh} />
				</Tooltip>

				<Button icon={<Tag20Regular />} onClick={openTagsDialog} disabled={isLoading}>
					Manage tags
				</Button>

				<Button appearance="primary" icon={<Add20Regular />} onClick={() => createLink()} disabled={isLoading}>
					Create
				</Button>
			</div>
		</header>
	);
}

const stateFilterOptions: Record<StateFilter, string> =
{
	all: "All links",
	enabled: "Enabled",
	disabled: "Disabled"
};

export type ShortenerHeaderProps =
	{
		filters: ShortenerFilters;
		onFilterUpdated: (filter: ShortenerFilters) => void;
	};
