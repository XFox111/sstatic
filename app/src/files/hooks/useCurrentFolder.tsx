import { useContext } from "react";
import CurrentFolderContext, { type CurrentFolderContextType } from "../contexts/CurrentFolderContext";

export default function useCurrentFolder(): CurrentFolderContextType
{
	return useContext<CurrentFolderContextType>(CurrentFolderContext);
}
