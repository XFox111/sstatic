import { Menu, MenuDivider, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, type MenuTriggerProps } from "@fluentui/react-components";
import useCurrentFolder from "../hooks/useCurrentFolder";
import type { OrderKey, SortByKey } from "../utils";

export default function SortMenu({ children }: Pick<MenuTriggerProps, "children">): React.ReactElement
{
	const { sortBy, order, setSortBy, setOrder } = useCurrentFolder();

	return (
		<Menu
			hasCheckmarks
			checkedValues={{ sort: [sortBy], order: [order] }}
			onCheckedValueChange={
				(_, e) => e.name === "sort"
					? setSortBy(e.checkedItems[0] as SortByKey)
					: setOrder(e.checkedItems[0] as OrderKey)
			}
		>
			<MenuTrigger disableButtonEnhancement>
				{children}
			</MenuTrigger>
			<MenuPopover>
				<MenuList>
					<MenuItemRadio name="sort" value="name">Name</MenuItemRadio>
					<MenuItemRadio name="sort" value="updatedAt">Modified</MenuItemRadio>
					<MenuItemRadio name="sort" value="size">File size</MenuItemRadio>
					<MenuDivider />
					<MenuItemRadio name="order" value="asc">Ascending</MenuItemRadio>
					<MenuItemRadio name="order" value="desc">Descending</MenuItemRadio>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}
