import { Avatar, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, Toast, ToastBody, ToastTitle, useTagPickerFilter, useToastController, type TagPickerControlProps, type TagPickerOnOptionSelectData } from "@fluentui/react-components";
import { Tag16Regular, Tag20Regular, TagAdd20Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { tags as tagsApi, type Tag as TagItem } from "../../api";
import useShortener from "../hooks/useShortener";
import { getForegroundColor, getRandomColor } from "../utils/color";

export default function TagInput({ allowCreation, selectedTags, disabled, onChange, ...props }: TagInputProps): React.ReactElement
{
	const shortener = useShortener();
	const toaster = useToastController();
	const [tags, setTags] = useState<TagItem[]>([]);
	const [isLoading, setLoading] = useState<boolean>(true);

	const [query, setQuery] = useState<string>("");
	const disableAutoFocus: boolean = query.length === 0;
	const placeholder: string = selectedTags.length === 0 ? "Select tags" : "";

	const children: React.ReactElement[] = useTagPickerFilter({
		query,
		options: tags.map(i => i.id.toString()),
		noOptionsElement: allowCreation && query.length > 0 ? (
			<TagPickerOption value="new-tag" media={<TagAdd20Regular />}>
				{`Create tag '${query}'`}
			</TagPickerOption>
		) : (
			<TagPickerOption value="no-match">
				Empty
			</TagPickerOption>
		),
		renderOption: tagId => renderTagOption(tags.find(t => t.id.toString() === tagId)!),
		filter: option =>
			!selectedTags.some(i => i.id.toString() === option) &&
			tags.find(i => i.id.toString() === option)?.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) === true
	});

	function onOptionSelect(_: unknown, data: TagPickerOnOptionSelectData): void
	{
		if (data.value === "no-match")
			return;

		if (data.value === "new-tag" && allowCreation)
			onChange([...selectedTags, { id: -selectedTags.length, name: query, color: getRandomColor() }]);
		else
		{
			onChange(data.selectedOptions.map(id =>
				selectedTags.find(t => t.id.toString() === id) ??
				tags.find(t => t.id.toString() === id)!
			));
		}

		setQuery("");
	}

	useEffect(() =>
	{
		async function loadTags(): Promise<void>
		{
			const [success, result] = await tagsApi.list();

			if (success)
			{
				setTags(result);
				setLoading(false);
			}
			else
				toaster.dispatchToast(
					<Toast>
						<ToastTitle>Failed to load tags</ToastTitle>
						<ToastBody>{result.detail || result.title}</ToastBody>
					</Toast>,
					{ intent: "error", timeout: -1 }
				);
		}

		if (!shortener)
			loadTags();
		else if (!shortener.isLoading)
		{
			setLoading(false);
			setTags(shortener.tags);
		}
	}, [shortener, toaster]);

	return (
		<TagPicker
			disabled={disabled || isLoading}
			onOptionSelect={onOptionSelect}
			selectedOptions={selectedTags.map(tag => tag.id.toString())}
			disableAutoFocus={disableAutoFocus}
		>
			<TagPickerControl
				expandIcon={isLoading ? <Spinner size="tiny" /> : <Tag20Regular />}
				{...props}
			>
				<TagPickerGroup aria-label="Selected tags">
					{selectedTags.map(renderPickedTag)}
				</TagPickerGroup>
				<TagPickerInput
					placeholder={placeholder}
					value={query} maxLength={16}
					onChange={e => setQuery(e.target.value)}
				/>
			</TagPickerControl>

			<TagPickerList>{children}</TagPickerList>
		</TagPicker>
	);
}

const renderTagOption = (tag: TagItem): React.ReactElement => (
	<TagPickerOption key={tag.id} value={tag.id.toString()}
		media={
			<Avatar
				size={24} style={{ marginRight: 4 }}
				icon={{
					children: <Tag20Regular style={{ marginTop: "1px", marginLeft: "-1px" }} />,
					style: { backgroundColor: tag.color, color: getForegroundColor(tag.color) }
				}}
			/>
		}
	>
		{tag.name}
	</TagPickerOption>
);

const renderPickedTag = (tag: TagItem): React.ReactElement => (
	<Tag key={tag.id.toString()} value={tag.id.toString()}
		shape="circular" appearance="outline"
		media={
			<Avatar
				icon={{
					children: <Tag16Regular />,
					style: { backgroundColor: tag.color, color: getForegroundColor(tag.color) }
				}}
			/>
		}
	>
		{tag.name}
	</Tag>
);

export type TagInputProps = Omit<TagPickerControlProps, "onChange"> &
{
	allowCreation?: boolean;
	selectedTags: TagItem[];
	onChange: (tags: TagItem[]) => void;
	disabled?: boolean;
};
