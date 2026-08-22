import { useContext } from "react";
import DialogContext, { type DialogContextType } from "../contexts/DialogContext";

export default function useDialog()
{
	return useContext<DialogContextType>(DialogContext);
}
