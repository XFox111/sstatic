import type { ApiResponse } from ".";
import api from "./api";

export const getRuntimeInfo = (): Promise<ApiResponse<GetRuntimeInfoResponse>> =>
	api.get("api/info");

export type GetRuntimeInfoResponse =
	{
		host: string;
		prefix: string;
		enableOpenApi: boolean;
		usePasswordAuth: boolean;
		isAuthenticated: boolean;
		shortener: ShortenerConfig;
		files: FilesConfig;
	};

export type ShortenerConfig =
{
	host: string;
	prefix: string;
	caseInsensitiveSlugs: boolean;
	defaultSlugLength: number;
};

export type FilesConfig =
{
	host: string;
	prefix: string;
	maxFileSize: number;
}
