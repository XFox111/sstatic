import type { ApiResponse } from ".";
import api from "./api";

export const getRuntimeInfo = (): Promise<ApiResponse<GetRuntimeInfoResponse>> =>
	api.get("api/info");

export type GetRuntimeInfoResponse =
	{
		enableOpenApi: boolean;
		isAuthenticated: boolean;
		shortenerHost: string;
		shortenerPrefix: string;
		filesHost: string;
		filesPrefix: string;
		appHost: string;
		appPrefix: string;
		usePasswordAuth: boolean;
		maxFileSize: number;
		caseInsensitiveSlugs: boolean;
		defaultSlugLength: number;
	};
