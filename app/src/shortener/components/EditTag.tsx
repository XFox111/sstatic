import { Avatar, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, mergeClasses, Spinner, tokens, Tooltip } from "@fluentui/react-components";
import { Checkmark20Regular, Color20Regular, Delete20Regular, Tag20Regular } from "@fluentui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tags, type Tag as TagItem } from "../../api/tags";
import useShortener from "../hooks/useShortener";
import { getForegroundColor, getRandomColor } from "../utils/color";
import { useStyles_EditTag } from "./EditTag.styles";

export default function EditTag(props: EditTagProps): React.ReactElement
{
	const { addTag, updateTag, deleteTag } = useShortener();
	const tag = props.tag ?? { id: 0, name: "", color: getRandomColor() };

	const [name, setName] = useState<string>(tag.name);
	const [color, setColor] = useState<string>(tag.color);
	const [editMode, setEditMode] = useState<"none" | "edit" | "delete" | "busy">(props.tag ? "none" : "edit");

	const foregroundColor = useMemo(() => getForegroundColor(color), [color]);
	const colorPickerRef = useRef<HTMLInputElement>(null);
	const tagRef = useRef<HTMLDivElement>(null);

	const reset = useCallback((): void =>
	{
		setName(tag.name);
		setColor(tag.color);
		setEditMode("none");
	}, [tag.color, tag.name]);

	function onPrimaryClick(event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void
	{
		props.onEditStart?.(tag);

		if (editMode === "none")
			setEditMode("edit");
		else if (editMode === "edit")
			event.currentTarget?.querySelector<HTMLInputElement>("input[type=text]")?.focus();
	};

	async function onUpdate(): Promise<void>
	{
		props.onError?.(null);

		if (name === tag.name && color === tag.color)
		{
			setEditMode("none");
			props.onEditEnd?.(tag);
			return;
		}

		setEditMode("busy");

		const [success, response] = tag.id === 0
			? await tags.create({ name, color })
			: await tags.update(tag.id, { name, color });

		if (success)
		{
			if (tag.id === 0)
				addTag(response);
			else
			{
				updateTag(response);
				setEditMode("none");
			}
		}
		else
		{
			props.onError?.(response.detail || response.title);
			setEditMode("edit");
		}
	};

	async function onDelete(): Promise<void>
	{
		if (tag.id === 0)
			return;

		props.onError?.(null);
		setEditMode("busy");
		const [success, error] = await tags.delete(tag.id);

		if (success)
			deleteTag(tag);
		else
		{
			props.onError?.(error.detail || error.title);
			setEditMode("delete");
		}
	};

	function onInitiateDelete(): void
	{
		props.onEditStart?.(tag);
		setEditMode("delete");
	};

	function onCancel(): void
	{
		reset();
		props.onEditEnd?.(tag);
	};

	useEffect(() =>
	{
		if (props.focused === false)
			reset();
	}, [props.focused, reset]);

	const cls = useStyles_EditTag();

	return (
		<InteractionTag appearance="outline" shape="circular" ref={tagRef}>
			<InteractionTagPrimary
				hasSecondaryAction={editMode !== "busy"}
				onClick={onPrimaryClick}
				media={{
					children: <>
						<Avatar
							className={cls.badge}
							onClick={editMode === "edit" ? () => colorPickerRef.current?.click() : undefined}
							icon={{
								children: editMode === "delete"
									? <Delete20Regular />
									: editMode === "busy"
										? <Spinner size="tiny" />
										: editMode === "edit"
											? <Color20Regular />
											: <Tag20Regular />,
								style: {
									backgroundColor: editMode === "busy" ? tokens.colorNeutralBackground1 : color,
									color: foregroundColor
								}
							}} />

						{editMode === "edit" &&
							<input type="color"
								tabIndex={-1}
								ref={colorPickerRef}
								className={cls.colorInput}
								value={color}
								onInput={(e) => setColor(e.currentTarget.value)} />
						}
					</>,
					className: cls.tag_media
				}}
			>
				{editMode === "edit" ?
					<input
						autoFocus
						type="text"
						maxLength={16}
						className={cls.input}
						placeholder="Tag name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)} />
					:
					editMode === "delete" ? "Are you sure?" : name
				}
			</InteractionTagPrimary>
			{editMode === "edit" &&
				<>
					<Tooltip relationship="label" content="Save">
						<InteractionTagSecondary
							className={mergeClasses(cls.secondaryButton, !name.trim() && cls.secondaryButton_disabled)}
							onClick={onUpdate} disabled={!name.trim()}
						>
							<Checkmark20Regular />
						</InteractionTagSecondary>
					</Tooltip>
					<Tooltip relationship="label" content="Cancel">
						<InteractionTagSecondary onClick={onCancel} />
					</Tooltip>
				</>
			}
			{editMode === "delete" &&
				<>
					<Tooltip relationship="label" content="Delete">
						<InteractionTagSecondary className={cls.secondaryButton} onClick={onDelete} autoFocus>
							<Checkmark20Regular />
						</InteractionTagSecondary>
					</Tooltip>
					<Tooltip relationship="label" content="Cancel">
						<InteractionTagSecondary onClick={onCancel} />
					</Tooltip>
				</>
			}
			{editMode === "none" &&
				<Tooltip relationship="label" content="Delete">
					<InteractionTagSecondary onClick={onInitiateDelete} />
				</Tooltip>
			}
		</InteractionTag>
	);
}

export type EditTagProps =
	{
		tag?: TagItem;
		focused?: boolean;

		onEditStart?: (tag: TagItem) => void;
		onEditEnd?: (tag: TagItem) => void;

		onError?: (error: string | null) => void;
	};
