import { createContext } from "react";
import type { GetRuntimeInfoResponse } from "../api";

export default createContext<RuntimeInfoContextType>(null!);

export type RuntimeInfoContextType = GetRuntimeInfoResponse &
{
	filesBaseUrl: string;
	shortenerBaseUrl: string;
};
