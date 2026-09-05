import { useCallback, useEffect, useState } from "react";
import { type Tag, links as linksApi, tags as tagsApi } from "../../api";
import type { ShortLink } from "../../api/links";
import type { DialogContextType } from "../../contexts/DialogContext";
import useDialog from "../../hooks/useDialog";
import useRuntimeInfo from "../../hooks/useRuntimeInfo";
import { ShortenerContext } from "../contexts/ShortenerContext";
import EditLinkDialog, { type EditLinkDialogProps } from "../dialogs/EditLinkDialog";

export default function ShortenerProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const dialog: DialogContextType = useDialog();
	const { shortenerBaseUrl } = useRuntimeInfo();
	const [isLoading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [links, setLinks] = useState<ShortLink[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const refresh = useCallback(async (): Promise<void> =>
	{
		async function fetchLinks(): Promise<void>
		{
			const [success, result] = await linksApi.list();

			if (success)
				setLinks(result);
			else
			{
				setError(result.detail || result.title);
				setLinks([]);
			}
		}

		async function fetchTags(): Promise<void>
		{
			const [success, result] = await tagsApi.list();

			if (success)
				setTags(result);
			else
			{
				setError(result.detail || result.title);
				setTags([]);
			}
		}

		setLoading(true);
		await fetchLinks();
		await fetchTags();
		setLoading(false);
	}, []);

	const createLink = useCallback(async (props?: Omit<EditLinkDialogProps, "link">): Promise<void> =>
	{
		const link: ShortLink | null = await dialog.pushCustom(EditLinkDialog, props ?? {});

		if (!link)
			return;

		setLinks([...links, link]);
		const newTags: Tag[] = link.tags.filter(tag => !tags.some(t => t.id === tag.id));

		if (newTags.length > 0)
			setTags([...tags, ...newTags]);
	}, [dialog, links, tags]);

	async function editLink(link: ShortLink): Promise<void>
	{
		const updatedLink: ShortLink | null = await dialog.pushCustom(EditLinkDialog, { link });

		if (!updatedLink)
			return;

		setLinks(links.map(l => l.slug === link.slug ? updatedLink : l));
		const newTags: Tag[] = updatedLink.tags.filter(tag => !tags.some(t => t.id === tag.id));

		if (newTags.length > 0)
			setTags([...tags, ...newTags]);
	}

	async function deleteLink(link: ShortLink): Promise<void>
	{
		const deleted: boolean = await dialog.pushPrompt({
			title: "Delete link",
			content: `Are you sure you want to delete link "${link.slug}"? This action cannot be undone.`,
			confirmText: "Delete",
			destructive: true,
			onConfirm: async setError =>
			{
				const [success, error] = await linksApi.delete(link.slug);

				if (success)
					return true;

				setError(error.detail || error.title);
				return false;
			}
		});

		if (deleted)
			setLinks(links.filter(l => l.slug !== link.slug));
	}

	function updateTag(tag: Tag): void
	{
		setTags(tags.map(t => t.id === tag.id ? tag : t));
		setLinks(links.map(l => l.tags.some(t => t.id === tag.id)
			? { ...l, tags: l.tags.map(t => t.id === tag.id ? tag : t) }
			: l
		));
	}

	function deleteTag(tag: Tag): void
	{
		setTags(tags.filter(t => t.id !== tag.id));
		setLinks(links.map(l => ({ ...l, tags: l.tags.filter(t => t.id !== tag.id) })));
	}

	function getUrl(link: ShortLink, full: boolean = false): string
	{
		return full
			? `${window.location.protocol}//${shortenerBaseUrl}${link.slug}`
			: shortenerBaseUrl + link.slug;
	}

	useEffect(() =>
	{
		refresh();
	}, [refresh]);

	useEffect(() =>
	{
		if (isLoading)
			return;

		const url: URL = new URL(window.location.href);
		const sharedUrl: string | null = url.searchParams.get("url");

		console.log("Shared URL: ", sharedUrl);

		if (sharedUrl)
		{
			createLink({ suggestedUrl: sharedUrl });
			window.history.replaceState(null, "", url.pathname);
		}
	}, [createLink, isLoading]);

	return (
		<ShortenerContext.Provider
			value={{
				isLoading, error,
				links, tags, refresh,
				createLink, editLink, deleteLink,
				addTag: tag => setTags([...tags, tag]), updateTag, deleteTag,
				getUrl
			}}
		>
			{children}
		</ShortenerContext.Provider>
	);
}
