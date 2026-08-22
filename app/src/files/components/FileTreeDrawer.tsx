import { Button, Divider, DrawerBody, DrawerHeader, DrawerHeaderTitle, makeStyles, OverlayDrawer, tokens, Tooltip } from "@fluentui/react-components";
import { bundleIcon, Dismiss24Regular, Home20Filled, Home20Regular, PanelLeftExpand20Filled, PanelLeftExpand20Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import useFiles from "../hooks/useFiles";
import FolderTree from "./FolderTree";

export default function FileTreeDrawer(): React.ReactElement
{
	const { rootFolder, currentFolder, setCurrentFolder } = useFiles();
	const [open, setOpen] = useState<boolean>(false);
	const cls = useStyles();

	useEffect(() =>
	{
		setOpen(false);
	}, [currentFolder]);

	return <>
		<Tooltip relationship="label" content="Show file tree">
			<Button appearance="subtle" icon={<ShowPanelIcon />} onClick={() => setOpen(true)} />
		</Tooltip>

		<OverlayDrawer
			className={cls.noDragArea}
			backdrop={{ className: cls.noDragArea }}
			open={open} onOpenChange={() => setOpen(false)}
		>
			<DrawerHeader>
				<DrawerHeaderTitle
					action={
						<Button
							appearance="subtle" icon={<Dismiss24Regular />}
							aria-label="Close"
							onClick={() => setOpen(false)}
						/>
					}
				>
					Files
				</DrawerHeaderTitle>
			</DrawerHeader>
			<DrawerBody className={cls.body}>
				<Button
					appearance="subtle" icon={<HomeIcon />} className={cls.home}
					onClick={() =>
					{
						setCurrentFolder(rootFolder);
						setOpen(false);
					}}
				>
					Home
				</Button>
				<Divider className={cls.divider} />
				<FolderTree />
			</DrawerBody>
		</OverlayDrawer>
	</>;
}

const ShowPanelIcon = bundleIcon(PanelLeftExpand20Filled, PanelLeftExpand20Regular);
const HomeIcon = bundleIcon(Home20Filled, Home20Regular);

const useStyles = makeStyles({
	noDragArea:
	{
		"app-region": "none"
	},
	body:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	},
	home:
	{
		justifyContent: "flex-start"
	},
	divider:
	{
		flexGrow: "none"
	}
});
