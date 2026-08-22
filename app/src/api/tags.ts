import type { ApiResponse } from ".";
import api from "./api";

export const tags =
{
	list: (): Promise<ApiResponse<Tag[]>> =>
		api.get("api/tags"),

	create: (request: UpdateTagRequest): Promise<ApiResponse<Tag>> =>
		api.post("api/tags", request),

	update: (id: number, request: UpdateTagRequest): Promise<ApiResponse<Tag>> =>
		api.put(`api/tags/${id}`, request),

	delete: (id: number): Promise<ApiResponse<void>> =>
		api.delete(`api/tags/${id}`)
};

export type Tag =
	{
		id: number;
		name: string;
		color: string;
	};

export type UpdateTagRequest =
	{
		name: string;
		color: string;
	};
