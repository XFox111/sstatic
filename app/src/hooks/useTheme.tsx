import { useContext } from "react";
import ThemeContext, { type ThemeContextType } from "../contexts/ThemeContext";

export default function useTheme(): ThemeContextType
{
	return useContext(ThemeContext);
}
