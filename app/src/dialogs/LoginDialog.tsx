import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Input, makeStyles, MessageBar, MessageBarBody, Spinner, tokens, Tooltip } from "@fluentui/react-components";
import { Dismiss20Regular, Key20Regular, Person20Regular, PersonArrowRight20Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { auth } from "../api";
import type { DialogProps } from "../contexts/DialogContext";

export default function LoginDialog({ close }: DialogProps): React.ReactElement
{
	const [busy, setBusy] = useState<boolean>(false);
	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const cls = useStyles();

	async function onSubmit(event: React.SubmitEvent<HTMLFormElement>): Promise<void>
	{
		event.preventDefault();
		setError(null);
		setBusy(true);

		const [success, error] = await auth.passwordLogin({ username: login, password });

		if (success)
		{
			close();
			document.location.reload();
		}
		else
		{
			setError(error.detail || error.title);
			setBusy(false);
		}
	};

	return (
		<DialogSurface className={cls.surface}>
			<form onSubmit={onSubmit}>
				<DialogBody>
					<DialogTitle
						action={
							<Tooltip relationship="label" content="Close">
								<Button appearance="subtle" icon={<Dismiss20Regular />} onClick={() => close()} />
							</Tooltip>
						}
					>
						Sign in
					</DialogTitle>
					<DialogContent className={cls.content}>
						<Input contentBefore={<Person20Regular />} placeholder="Login"
							value={login} onChange={(_, e) => setLogin(e.value)}
							disabled={busy}
						/>
						<Input contentBefore={<Key20Regular />} type="password" placeholder="Password"
							value={password} onChange={(_, e) => setPassword(e.value)}
							disabled={busy}
						/>
						{error &&
							<MessageBar intent="error">
								<MessageBarBody>{error}</MessageBarBody>
							</MessageBar>
						}
					</DialogContent>
					<DialogActions>
						{busy && <Spinner size="tiny" />}
						<Button
							appearance="primary" icon={<PersonArrowRight20Regular />}
							type="submit" disabled={busy}
						>
							Sign in
						</Button>
					</DialogActions>
				</DialogBody>
			</form>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	surface:
	{
		maxWidth: "400px"
	},
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	}
});
