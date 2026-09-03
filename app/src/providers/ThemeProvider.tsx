import { FluentProvider, webDarkTheme, webLightTheme, type FluentProviderProps, type Theme } from "@fluentui/react-components";
import { useEffect, useMemo, useState } from "react";
import ThemeContext, { type ThemeKey, type ThemeOptionKey, type ThemeOptions } from "../contexts/ThemeContext";

export default function ThemeProvider({ children, ...props }: Omit<FluentProviderProps, "theme">): React.ReactElement
{
	const [options, setOptions] = useState<ThemeOptions>({
		name: (localStorage.getItem(themeStorageKey) ?? "system") as ThemeOptionKey,
		useOled: localStorage.getItem(themeOledStorageKey) === "true"
	});
	const [themeMatches, setThemeMatches] = useState<boolean>(media.matches);

	const themeKey = useMemo(() => getThemeKey(themeMatches, options), [themeMatches, options]);
	const theme = useMemo(() => themes[themeKey], [themeKey]);

	const setTheme = (name: ThemeOptionKey, useOled: boolean) =>
	{
		localStorage.setItem(themeStorageKey, name);
		localStorage.setItem(themeOledStorageKey, useOled ? "true" : "false");
		setOptions({ name, useOled });
	};

	useEffect(() =>
	{
		if (options.name !== "system")
			return;

		const updateTheme = (args: MediaQueryListEvent): void => setThemeMatches(args.matches);
		media.addEventListener("change", updateTheme);

		return () => media.removeEventListener("change", updateTheme);
	}, [options]);

	useEffect(() =>
	{
		const color: string = themeKey === "dark" ? "#292929"
			: themeKey === "oled" ? "#000000" : "#ffffff";

		document.head
			.querySelector("meta[name=theme-color]")
			?.setAttribute("content", color);
	}, [themeKey]);

	return (
		<ThemeContext.Provider
			value={{
				theme: themeKey,
				isDark: themeKey !== "light",
				options, setTheme
			}}
		>
			<FluentProvider theme={theme} {...props}>
				{children}
			</FluentProvider>
		</ThemeContext.Provider>
	);
}

const media: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey: string = "theme";
const themeOledStorageKey: string = "theme.oled";
const themes: Record<ThemeKey, Theme> =
{
	light: webLightTheme,
	dark: webDarkTheme,
	oled:
	{
		...webDarkTheme,
		colorNeutralBackground1: "#000000",
		colorNeutralBackground2: "#000000",
		colorTransparentStroke: webDarkTheme.colorNeutralStroke1
	}
};

function getThemeKey(darkMatches: boolean, options: ThemeOptions): ThemeKey
{
	if (options.name === "light")
		return "light";

	if (options.name === "dark" || darkMatches)
		return options.useOled ? "oled" : "dark";

	return "light";
}
