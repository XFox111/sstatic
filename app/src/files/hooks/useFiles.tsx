import { useContext } from "react";
import FilesContext, { type FilesContextType } from "../contexts/FilesContext";

export default function useFiles(): FilesContextType
{
	return useContext<FilesContextType>(FilesContext);
}
