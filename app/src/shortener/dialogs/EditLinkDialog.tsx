import { Button, Checkbox, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Field, Input, makeStyles, MessageBar, MessageBarBody, Spinner, Switch, Text, tokens, Tooltip } from "@fluentui/react-components";
import { bundleIcon, PenSync20Filled, PenSync20Regular } from "@fluentui/react-icons";
import React, { useMemo, useState } from "react";
import { links, type ShortLink, type UpdateLinkRequest } from "../../api";
import { type Tag } from "../../api/tags";
import type { DialogProps } from "../../contexts/DialogContext";
import useRuntimeInfo from "../../hooks/useRuntimeInfo";
import TagInput from "../components/TagInput";

export default function EditLinkDialog(props: DialogProps<EditLinkDialogProps, ShortLink | null>): React.ReactElement
{
	const { caseInsensitiveSlugs, shortenerBaseUrl } = useRuntimeInfo();
	const [generatedSlug, setGeneratedSlug] = useState<string>(randomSlug());
	const [slug, setSlug] = useState<string>(props.link?.slug ?? props.suggestedSlug ?? "");
	const [redirectUrl, setRedirectUrl] = useState<string>(props.link?.redirectUrl ?? props.suggestedUrl ?? "");
	const [forwardQuery, setForwardQuery] = useState<boolean>(props.link?.forwardQuery ?? false);
	const [enabled, setEnabled] = useState<boolean>(props.link?.isEnabled ?? true);
	const [resetVisits, setResetVisits] = useState<boolean>(false);
	const [selectedTags, setSelectedTags] = useState<Tag[]>(props.link?.tags ?? []);

	const [busy, setBusy] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const validSlug = useMemo<boolean>(() => /^[a-zA-Z0-9-_.]*$/.test(slug), [slug]);
	const canSubmit = useMemo<boolean>(() => validSlug && redirectUrl.trim().length > 0, [validSlug, redirectUrl]);

	const cls = useStyles();

	async function submit(event: React.SubmitEvent<HTMLFormElement>): Promise<void>
	{
		event.preventDefault();

		if (!canSubmit)
			return;

		setBusy(true);
		setError(null);

		const request: UpdateLinkRequest = {
			slug: slug || generatedSlug,
			redirectUrl: redirectUrl.trim(),
			forwardQuery,
			isEnabled: enabled,
			tags: selectedTags.map(tag => ({ id: Math.max(0, tag.id), name: tag.name, color: tag.color })),
			resetVisits
		};

		const [success, result] = props.link
			? await links.update(props.link.slug, request)
			: await links.create(request);

		if (success)
			props.close(result);
		else
		{
			setError(result.detail || result.title);
			setBusy(false);
		}
	}

	return (
		<DialogSurface>
			<form onSubmit={submit}>
				<DialogBody>
					<DialogTitle>
						{props.link ? "Edit short link" : "New short link"}
					</DialogTitle>
					<DialogContent className={cls.content} >

						<Switch label="Enabled" checked={enabled} disabled={busy}
							onChange={(_, data) => setEnabled(data.checked)} />

						<Field label="Slug"
							hint={caseInsensitiveSlugs ? undefined : "Slugs are case-sensitive."}
							validationMessage={!validSlug
								? "Slug can only contain letters, numbers, hyphens, underscores, and periods." : undefined
							}
						>
							<Input
								value={slug}
								onChange={(_, data) => setSlug(data.value)}
								placeholder={generatedSlug}
								disabled={busy}
								className={cls.slugInput}
								contentBefore={<Text>{shortenerBaseUrl}</Text>}
								contentAfter={slug ? undefined :
									<Tooltip relationship="label" content="Randomize slug">
										<Button
											appearance="subtle"
											size="small"
											icon={<RandomizeIcon />}
											disabled={busy}
											onClick={() => setGeneratedSlug(randomSlug())}
										/>
									</Tooltip>
								} />
						</Field>

						{slug === "_catch-all" &&
							<MessageBar intent="info">
								<MessageBarBody>
									"_catch-all" is a special slug that will match any URL that doesn't match any other slug.
								</MessageBarBody>
							</MessageBar>
						}

						<Field label="Redirect to" required>
							<Input type="url" required
								value={redirectUrl}
								onChange={(_, data) => setRedirectUrl(data.value)}
								placeholder="https://example.com"
								disabled={busy}
							/>
						</Field>

						<Checkbox label="Forward query parameters"
							checked={forwardQuery}
							onChange={(_, data) => setForwardQuery(data.checked === true)}
							disabled={busy}
						/>

						<Field label="Tags">
							<TagInput
								selectedTags={selectedTags}
								onChange={setSelectedTags}
								disabled={busy}
								allowCreation
							/>
						</Field>

						{(props.link?.visits ?? 0) > 0 &&
							<Checkbox label="Reset visit counter"
								checked={resetVisits}
								onChange={(_, data) => setResetVisits(data.checked === true)}
								disabled={busy}
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
						<Button appearance="primary" type="submit" disabled={busy || !canSubmit}>
							{props.link ? "Update" : "Create"}
						</Button>
						<Button appearance="subtle" disabled={busy} onClick={() => props.close(null)}>
							Cancel
						</Button>
					</DialogActions>
				</DialogBody>
			</form>
		</DialogSurface>
	);
}

function randomSlug(): string
{
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const bytes = new Uint8Array(8);
	crypto.getRandomValues(bytes);

	return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join("");
}

const RandomizeIcon = bundleIcon(PenSync20Filled, PenSync20Regular);

const useStyles = makeStyles({
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	},
	slugInput:
	{
		overflow: "hidden"
	}
});

export type EditLinkDialogProps =
	{
		link?: ShortLink;
		suggestedSlug?: string;
		suggestedUrl?: string;
	};
