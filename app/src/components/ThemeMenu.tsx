import { Menu, MenuDivider, MenuItemCheckbox, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, type MenuCheckedValueChangeData, type MenuCheckedValueChangeEvent, type MenuTriggerProps } from "@fluentui/react-components";
import { DarkTheme20Filled } from "@fluentui/react-icons";
import { useMemo } from "react";
import { type ThemeOptionKey } from "../contexts/ThemeContext";
import useTheme from "../hooks/useTheme";
import { DarkThemeIcon, LightThemeIcon, SystemThemeIcon } from "./CurrentThemeIcon";

export default function ThemeMenu({ children }: Pick<MenuTriggerProps, "children">): React.ReactElement
{
	const { options, setTheme } = useTheme();
	const checkedValues: Record<string, string[]> = useMemo(() => ({
		useOled: [options.useOled ? "true" : "false"],
		theme: [options.name]
	}), [options]);

	function onCheckedValueChange(_: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData): void
	{
		if (data.name === "useOled")
			setTheme(options.name, data.checkedItems.includes("true"));
		else if (data.name === "theme")
			setTheme(data.checkedItems[0] as ThemeOptionKey, options.useOled);
	};

	return (
		<Menu hasCheckmarks checkedValues={checkedValues} onCheckedValueChange={onCheckedValueChange}>
			<MenuTrigger disableButtonEnhancement>
				{children}
			</MenuTrigger>

			<MenuPopover>
				<MenuList>
					<MenuItemRadio name="theme" value="system" icon={<SystemThemeIcon />}>
						System
					</MenuItemRadio>
					<MenuItemRadio name="theme" value="light" icon={<LightThemeIcon />}>
						Light
					</MenuItemRadio>
					<MenuItemRadio name="theme" value="dark" icon={<DarkThemeIcon />}>
						Dark
					</MenuItemRadio>
					<MenuDivider />
					<MenuItemCheckbox name="useOled" value="true" icon={<DarkTheme20Filled />}
						disabled={options.name === "light"}
					>
						Use extra dark theme
					</MenuItemCheckbox>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}
