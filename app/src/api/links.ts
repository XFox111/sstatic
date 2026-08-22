import type { ApiResponse } from ".";
import api from "./api";
import type { Tag } from "./tags";

export const links =
{
	list: (request?: ListLinksRequest): Promise<ApiResponse<ShortLink[]>> =>
		api.get("api/links", request),

	create: (request: UpdateLinkRequest): Promise<ApiResponse<ShortLink>> =>
		api.post("api/links", request),

	get: (slug: string): Promise<ApiResponse<ShortLink>> =>
		api.get(`api/links/${slug}`),

	update: (slug: string, request: UpdateLinkRequest): Promise<ApiResponse<ShortLink>> =>
		api.post(`api/links/${slug}`, request),

	delete: (slug: string): Promise<ApiResponse<void>> =>
		api.delete(`api/links/${slug}`)
};

export type UpdateLinkRequest =
	{
		slug: string;
		redirectUrl: string;
		forwardQuery: boolean;
		isEnabled: boolean;
		resetVisits: boolean;
		tags: Tag[];
	};

export type ShortLink =
	{
		slug: string;
		redirectUrl: string;
		forwardQuery: boolean;
		isEnabled: boolean;
		tags: Tag[];
		createdAt: string;
		updatedAt: string;
		visits: number;
	};

export type ListLinksRequest =
	{
		tags?: number[];
		enabled?: boolean;
	};
