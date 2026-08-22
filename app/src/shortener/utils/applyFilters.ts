import type { ShortLink, Tag } from "../../api";

export default function applyFilters(links: ShortLink[], filters: ShortenerFilters): ShortLink[]
{
	const { tags, state } = filters;

	return links
		.filter(link =>
			(tags.length === 0 || tags.every(tag => link.tags.some(t => t.id === tag.id))) &&
			(state === "all" || (state === "enabled") === link.isEnabled))
		.sort((a, b) =>
			a.slug === "_catch-all" ? 1
				: b.slug === "_catch-all" ? -1
					: new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export type ShortenerFilters =
	{
		state: StateFilter;
		tags: Tag[];
	};

export type StateFilter = "all" | "enabled" | "disabled";
