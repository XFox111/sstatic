import { createContext } from "react";


export default createContext<ThemeContextType>(null!);

export type ThemeContextType = {
	theme: ThemeKey;
	isDark: boolean;
	options: ThemeOptions;
	setTheme: (name: ThemeOptionKey, useOled: boolean) => void;
};

export type ThemeKey = "light" | "dark" | "oled";

export type ThemeOptionKey = "light" | "dark" | "system";

export type ThemeOptions = {
	name: ThemeOptionKey;
	useOled: boolean;
};
