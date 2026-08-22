import type { ApiResponse } from ".";
import api from "./api";

export const files =
{
	getInfo: (path: string): Promise<ApiResponse<DirectoryChild>> =>
		api.get(`api/files/${path}`),

	create: (path: string, request: CreateFileRequest): Promise<ApiResponse<DirectoryChild>> =>
		api.post(`api/files/${path}`, request),

	upload: (path: string, file: File, onProgress?: (percent: number) => void, signal?: AbortSignal): Promise<ApiResponse<FileDetails>> =>
		new Promise<ApiResponse<FileDetails>>(resolve =>
		{
			const request = new XMLHttpRequest();

			if (onProgress)
				request.upload.onprogress = event =>
				{
					if (!event.lengthComputable)
						return;

					onProgress((event.loaded / event.total) * 100);
				};

			request.onload = () =>
			{
				if (request.status !== 201)
				{
					if (request.responseType === "json")
						resolve([false, JSON.parse(request.response)]);
					else
						resolve([false, {
							status: request.status,
							type: "server-error",
							title: request.statusText,
							detail: `Server responded with status ${request.status}`,
							traceId: "-1"
						}]);

					return;
				}

				resolve([true, JSON.parse(request.response)]);
			};

			request.onerror = () =>
				resolve([false, {
					status: 0,
					type: "client-error",
					title: "Something went wrong",
					detail: "Could not connect to the server",
					traceId: "-1"
				}]);

			request.onabort = () =>
				resolve([false, {
					status: 0,
					type: "client-abort",
					title: "Request was cancelled",
					traceId: "-1"
				}]);

			if (signal)
				signal.onabort = () => request.abort();

			const formData = new FormData();
			formData.append("file", file);

			request.open("PUT", `api/files/${path}`, true);
			request.send(formData);
		}),

	update: (path: string, request: UpdateFileRequest): Promise<ApiResponse<DirectoryChild>> =>
		api.patch(`api/files/${path}`, request),

	move: (path: string, destination: string): Promise<ApiResponse<DirectoryChild>> =>
		files.update(path, { destination }),

	writeContent: (path: string, content: string): Promise<ApiResponse<FileDetails>> =>
		files.update(path, { content }) as Promise<ApiResponse<FileDetails>>,

	delete: (path: string): Promise<ApiResponse<void>> =>
		api.delete(`api/files/${path}`)
};

export type FileDetails =
	{
		name: string;
		path: string;
		mime: string;
		size: number;
		createdAt: string;
		updatedAt: string;
		type: "file";
	};

export type DirectoryDetails =
	{
		name: string;
		path: string;
		createdAt: string;
		updatedAt: string;
		children?: DirectoryChild[];
		type: "directory";
	};

export type UpdateFileRequest =
	{ destination: string; } | { content: string; };

export type DirectoryChild = FileDetails | DirectoryDetails;

export type CreateFileRequest =
	{
		name: string;
		type: ItemType;
	};

export type ItemType = "file" | "directory";
