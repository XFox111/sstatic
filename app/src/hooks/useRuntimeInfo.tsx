import { useContext } from "react";
import RuntimeInfoContext, { type RuntimeInfoContextType } from "../contexts/RuntimeInfoContext";


export default function useRuntimeInfo()
{
	return useContext<RuntimeInfoContextType>(RuntimeInfoContext);
}
