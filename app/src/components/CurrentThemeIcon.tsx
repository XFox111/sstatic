import { bundleIcon, Color20Filled, Color20Regular, WeatherMoon20Filled, WeatherMoon20Regular, WeatherSunny20Filled, WeatherSunny20Regular, type FluentIcon } from "@fluentui/react-icons";
import useTheme from "../hooks/useTheme";

const CurrentThemeIcon: FluentIcon = props =>
{
	const { options } = useTheme();

	if (options.name === "light")
		return <LightThemeIcon {...props} />;

	if (options.name === "dark")
		return <DarkThemeIcon {...props} />;

	return <SystemThemeIcon {...props} />;
};

export default CurrentThemeIcon;

/* eslint-disable react-refresh/only-export-components */
export const SystemThemeIcon: FluentIcon = bundleIcon(Color20Filled, Color20Regular);
export const LightThemeIcon: FluentIcon = bundleIcon(WeatherSunny20Filled, WeatherSunny20Regular);
export const DarkThemeIcon: FluentIcon = bundleIcon(WeatherMoon20Filled, WeatherMoon20Regular);
