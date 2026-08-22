import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, makeStyles, OverlayDrawer, tokens, type ButtonProps } from "@fluentui/react-components";
import { Dismiss20Regular, Navigation20Regular } from "@fluentui/react-icons";
import { useState } from "react";
import useRuntimeInfo from "../hooks/useRuntimeInfo";
import ApiDocsButton from "./ApiDocsButton";
import NavigationMenu from "./NavigationMenu";
import UserCard from "./UserCard";

export default function DrawerMenu(props: ButtonProps): React.ReactElement
{
	const { enableOpenApi } = useRuntimeInfo();
	const [open, setOpen] = useState<boolean>(false);
	const cls = useStyles();

	return (
		<>
			<Button
				aria-label="open menu"
				icon={<Navigation20Regular />} appearance="subtle"
				{...props}
				onClick={() => setOpen(true)} />

			<OverlayDrawer
				className={cls.drawer}
				backdrop={{ className: cls.backdrop }}
				open={open} onOpenChange={() => setOpen(false)}
			>
				<DrawerHeader>
					<DrawerHeaderTitle
						action={
							<Button
								appearance="subtle"
								aria-label="close"
								icon={<Dismiss20Regular />}
								onClick={() => setOpen(false)}
							/>
						}
					>
						sstatic
					</DrawerHeaderTitle>
				</DrawerHeader>
				<DrawerBody>
					<NavigationMenu vertical onTabSelect={() => setOpen(false)} />
				</DrawerBody>
				<DrawerFooter className={cls.drawerFooter}>
					{enableOpenApi && <ApiDocsButton className={cls.drawerButton} />}
					<UserCard className={cls.drawerButton} />
				</DrawerFooter>
			</OverlayDrawer>
		</>
	);
}

const useStyles = makeStyles({
	drawer:
	{
		width: "240px",
		"app-region": "none"
	},
	backdrop:
	{
		"app-region": "none"
	},
	drawerFooter:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "stretch",
		gap: tokens.spacingVerticalM
	},
	drawerButton:
	{
		justifyContent: "stretch"
	}
});
