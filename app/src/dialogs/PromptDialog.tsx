import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, makeStyles, mergeClasses, MessageBar, MessageBarBody, Spinner, tokens } from "@fluentui/react-components";
import { useState } from "react";
import type { DialogProps } from "../contexts/DialogContext";
import { useDangerStyles } from "../hooks/useDangerStyles";
import type { PromptDialogProps } from "../providers/DialogProvider";

export default function PromptDialog(props: DialogProps<PromptDialogProps, boolean>): React.ReactElement
{
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState<boolean>(false);

	const cls = useStyles();
	const dangerCls = useDangerStyles();

	async function onConfirm(event: React.SubmitEvent<HTMLFormElement>): Promise<void>
	{
		event.preventDefault();
		setError(null);

		if (!props.onConfirm)
		{
			props.close(true);
			return;
		}

		try
		{
			let result: boolean | void | Promise<void> | Promise<boolean> = props.onConfirm(setError);

			if (typeof result === "object")
			{
				setBusy(true);
				result = await result;
			}

			if (typeof result === "undefined" || result === true)
			{
				props.close(true);
				return;
			}
		}
		catch
		{
			setError("An unknown error occured.");
		}

		setBusy(false);
	};

	return (
		<DialogSurface>
			<form onSubmit={onConfirm}>
				<DialogBody>

					<DialogTitle>{props.title}</DialogTitle>

					<DialogContent className={cls.content}>
						{props.content}

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
						<Button
							appearance="primary"
							className={mergeClasses(props.destructive && dangerCls.buttonPrimary)}
							type="submit"
							disabled={busy}
						>
							{props.confirmText}
						</Button>
						<Button appearance="subtle" disabled={busy}
							onClick={() => props.close(false)}
						>
							{props.cancelText ?? "Cancel"}
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
