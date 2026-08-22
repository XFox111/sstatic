import type { ApiResponse, ProblemDetails, ValidationProblemDetails } from ".";
import { type PreventPageUnloadHandler, preventPageUnload } from "../utils";

const api =
{
	get: <TResponse>(url: string, queryParams?: object): Promise<ApiResponse<TResponse>> =>
		fetchApi<TResponse>(url, { method: "GET" }, queryParams),
	post: <TResponse>(url: string, body?: object): Promise<ApiResponse<TResponse>> =>
		fetchApi<TResponse>(url, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
	put: <TResponse>(url: string, body?: object): Promise<ApiResponse<TResponse>> =>
		fetchApi<TResponse>(url, { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
	patch: <TResponse>(url: string, body?: object): Promise<ApiResponse<TResponse>> =>
		fetchApi<TResponse>(url, { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
	delete: <TResponse>(url: string, body?: object, queryParams?: object): Promise<ApiResponse<TResponse>> =>
		fetchApi<TResponse>(url, { method: "DELETE", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }, queryParams),

	fetch: fetchApi
};

export default api;

async function fetchApi<TResponse>(
	url: string,
	options: RequestInit,
	queryParams?: object
): Promise<ApiResponse<TResponse>>
{
	let fetchUrl: string = url;

	if (queryParams)
	{
		const queryString = getQueryString(queryParams);

		if (queryString)
			fetchUrl += `?${queryString}`;
	}

	const pageBlock: PreventPageUnloadHandler = preventPageUnload();

	const response = await fetch(fetchUrl, options);
	let body: object | undefined = undefined;

	try
	{
		body = await response.json();
	} catch { /* empty */ }

	pageBlock.release();

	if (response.ok)
		return [true, body as TResponse];

	if (response.status === 400)
		return [false, body as ValidationProblemDetails];

	return [false, await response.json() as ProblemDetails];
}

function getQueryString(queryParams: object): string
{
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(queryParams))
	{
		if (value === undefined || value === null)
			continue;

		if (Array.isArray(value))
		{
			for (const item of value)
				params.append(key, String(item));

			continue;
		}

		params.append(key, String(value));
	}

	return params.toString();
}
