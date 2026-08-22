import type { ApiResponse } from ".";
import api from "./api";

export const auth =
{
	getUserInfo: (): Promise<ApiResponse<GetUserResponse>> =>
		api.get("auth/user"),

	passwordLogin: (request: LoginRequest): Promise<ApiResponse<void>> =>
		api.post("auth/login", request),

	getLoginLink: (): string =>
		`auth/login?redirect=${encodeURIComponent(document.location.pathname + document.location.hash)}`,

	getLogoutLink: (): string =>
		`auth/logout?redirect=${encodeURIComponent(document.location.pathname + document.location.hash)}`
};

export type LoginRequest =
	{
		username: string,
		password: string;
	};

export type GetUserResponse =
	{
		subject: string;
		displayName?: string;
		email?: string;
		idpAvatar?: string;
	};
