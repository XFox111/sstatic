import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Field, Input, makeStyles, MessageBar, MessageBarBody, Spinner, tokens } from "@fluentui/react-components";
import { Rename20Regular } from "@fluentui/react-icons";
import { useMemo, useState } from "react";
import { files, type DirectoryChild, type ItemType } from "../../api";
import type { DialogProps } from "../../contexts/DialogContext";
import useFiles from "../hooks/useFiles";
import { validateFilename } from "../utils";

export default function EditFileDialog(
	{ close, ...props }: DialogProps<EditFileDialogProps, DirectoryChild | null>
): React.ReactElement
{
	const { currentFolder } = useFiles();

	const [name, setName] = useState<string>(props.item ? props.item.name : "");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState<boolean>(false);

	const isValid = useMemo<boolean>(() => !name || validateFilename(name), [name]);
	const canSubmit = useMemo<boolean>(
		() => validateFilename(name) && (!props.item || props.item.name !== name),
		[name, props.item]
	);

	const cls = useStyles();

	async function onSubmit(event: React.SubmitEvent<HTMLFormElement>): Promise<void>
	{
		event.preventDefault();

		if (!canSubmit)
			return;

		setBusy(true);
		setError(null);

		const [success, result] = props.item
			? await files.move(
				props.item.path,
				currentFolder.path ? currentFolder.path + "/" + name : name
			)
			: await files.create(
				currentFolder.path,
				{ name, type: props.type }
			);

		if (success)
			close(result);
		else
		{
			setError(result.detail || result.title);
			setBusy(false);
		}
	}

	return (
		<DialogSurface>
			<form onSubmit={onSubmit}>
				<DialogBody>
					<DialogTitle>
						{props.item
							? "Rename"
							: props.type === "directory"
								? "Create an empty folder"
								: "Create an empty file"
						}
					</DialogTitle>
					<DialogContent className={cls.content}>
						<Field label="Name" hint="Case-sensitive" required
							validationMessage={isValid ? undefined : "Invalid name"}
						>
							<Input required
								value={name} onChange={(_, data) => setName(data.value)}
								contentBefore={<Rename20Regular />}
								placeholder="Enter your new name"
								disabled={busy} />
						</Field>
						{error &&
							<MessageBar intent="error">
								<MessageBarBody>{error}</MessageBarBody>
							</MessageBar>
						}
					</DialogContent>
					<DialogActions>
						{busy &&
							<Spinner size="tiny" />
						}
						<Button appearance="primary" type="submit" disabled={busy || !canSubmit}>
							{props.item ? "Rename" : "Create"}
						</Button>
						<Button appearance="subtle" disabled={busy} onClick={() => close(null)}>
							Cancel
						</Button>
					</DialogActions>
				</DialogBody>
			</form>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	}
});

export type EditFileDialogProps =
	{ item: DirectoryChild; } | { type: ItemType; item?: undefined; };
