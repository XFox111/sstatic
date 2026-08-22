export * from "./auth";
export * from "./files";
export * from "./getRuntimeInfo";
export * from "./links";
export * from "./tags";

export type ApiResponse<T> = [true, T] | [false, ProblemDetails | ValidationProblemDetails];

export type ProblemDetails =
	{
		type: string;
		title: string;
		status: number;
		detail?: string;
		traceId: string;
		[key: string]: unknown;
	};

export type ValidationProblemDetails = ProblemDetails & {
	errors?: Record<string, string[]>;
};
