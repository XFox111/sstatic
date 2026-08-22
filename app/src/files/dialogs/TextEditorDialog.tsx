import { defaultKeymap } from "@codemirror/commands";
import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, makeStyles, MessageBar, MessageBarBody, Spinner, tokens } from "@fluentui/react-components";
import createTheme, { type CreateThemeOptions } from "@uiw/codemirror-themes";
import ReactCodeMirror, { keymap } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { files as filesApi, type FileDetails } from "../../api";
import type { DialogProps } from "../../contexts/DialogContext";
import useTheme from "../../hooks/useTheme";
import useFiles from "../hooks/useFiles";

export default function TextEditorDialog(
	{ file, close }: DialogProps<TextEditorDialogProps, FileDetails | null>
): React.ReactElement
{
	const files = useFiles();
	const { isDark } = useTheme();
	const [busy, setBusy] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [content, setContent] = useState<string | null>(null);
	const cls = useStyles();

	useEffect(() =>
	{
		async function fetchContent(): Promise<void>
		{
			const response = await fetch(files.getUrl(file), { cache: "no-store" });

			if (response.ok)
				setContent(await response.text());
			else
				setError("Something went wrong.");

			setBusy(false);
		}

		fetchContent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	async function save(): Promise<void>
	{
		if (content === null)
			return;

		setError(null);
		setBusy(true);

		const [success, result] = await filesApi.writeContent(file.path, content);

		if (success)
			close(result);
		else
		{
			setError(result.detail || result.title);
			setBusy(false);
		}
	}

	const editorKeymaps = keymap.of([
		{
			key: "Ctrl-Enter",
			preventDefault: true,
			run: (): boolean =>
			{
				save();
				return true;
			}
		},
		...defaultKeymap,
	]);

	return (
		<DialogSurface className={cls.surface}>
			<DialogBody>
				<DialogTitle>Edit "{file.name}"</DialogTitle>
				<DialogContent className={cls.content}>
					{content === null ?
						<>Loading...</>
						:
						<ReactCodeMirror
							readOnly={busy}
							autoFocus
							className={cls.editor}
							maxHeight="60vh"
							value={content} onChange={setContent}
							theme={isDark ? editorDarkTheme : editorLightTheme}
							basicSetup={{
								foldGutter: false,
								tabSize: 4,
								defaultKeymap: false
							}}
							extensions={[editorKeymaps]}
						/>
					}

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
					<Button appearance="primary" type="submit" disabled={busy} onClick={save}>
						Save
					</Button>
					<Button appearance="subtle" disabled={busy && content !== null} onClick={() => close(null)}>
						Cancel
					</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	surface:
	{
		maxWidth: "800px"
	},
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	},
	editor:
	{
		border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
		borderRadius: tokens.borderRadiusMedium,
		overflow: "clip"
	}
});

const editorTheme: Omit<CreateThemeOptions, "theme"> =
{
	settings:
	{
		fontFamily: tokens.fontFamilyMonospace,
		fontSize: tokens.fontSizeBase300,

		background: tokens.colorNeutralBackground1,
		foreground: tokens.colorNeutralForeground1,
		caret: tokens.colorNeutralForeground1,
		lineHighlight: tokens.colorNeutralStrokeAlpha,
		selection: tokens.colorBrandBackgroundSelected,
		selectionMatch: tokens.colorNeutralBackground1Hover,

		gutterBackground: tokens.colorNeutralBackground1,
		gutterForeground: tokens.colorNeutralForeground4,
		gutterBorder: tokens.colorNeutralStroke1,
		gutterActiveForeground: tokens.colorNeutralForeground1
	},
	styles: []
};

const editorLightTheme = createTheme({ theme: "light", ...editorTheme });
const editorDarkTheme = createTheme({ theme: "dark", ...editorTheme });

export type TextEditorDialogProps =
	{
		file: FileDetails;
	};
