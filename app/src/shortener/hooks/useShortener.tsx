import { useContext } from "react";
import { type ShortenerContextType, ShortenerContext } from "../contexts/ShortenerContext";


export default function useShortener()
{
	return useContext<ShortenerContextType>(ShortenerContext);
}
