import { createContext } from "react";
import type { ShortLink, Tag } from "../../api";
import type { EditLinkDialogProps } from "../dialogs/EditLinkDialog";

export const ShortenerContext = createContext<ShortenerContextType>(null!);

export type ShortenerContextType = {
	isLoading: boolean;
	error: string | null;
	links: ShortLink[];
	tags: Tag[];

	getUrl(link: ShortLink, full?: boolean): string;

	refresh(): void;

	createLink(props?: Omit<EditLinkDialogProps, "link">): void;
	editLink(link: ShortLink): void;
	deleteLink(link: ShortLink): void;

	addTag(tag: Tag): void;
	updateTag(tag: Tag): void;
	deleteTag(tag: Tag): void;
};
