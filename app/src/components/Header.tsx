import { Title1, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import useMediaQuery from "../hooks/useMediaQuery";
import useRuntimeInfo from "../hooks/useRuntimeInfo";
import UserInfoProvider from "../providers/UserInfoProvider";
import ApiDocsButton from "./ApiDocsButton";
import DrawerMenu from "./DrawerMenu";
import NavigationMenu from "./NavigationMenu";
import UserCard from "./UserCard";

export default function Header(): React.ReactElement
{
	const { enableOpenApi } = useRuntimeInfo();
	const hideNavigation = useMediaQuery("(max-width: 800px)");
	const simplifyNavigation = useMediaQuery("(max-width: 1024px)");
	const cls = useStyles();

	return (
		<UserInfoProvider>
			<header className={cls.header}>
				<div className={cls.titleContainer}>
					{hideNavigation &&
						<DrawerMenu className={mergeClasses(cls.drawerButton, cls.noDragArea)} />
					}
					<img src="./logo.svg" alt="" className={cls.logo} draggable={false} />
					<Title1 as="h1" className={cls.title}>sstatic</Title1>
				</div>

				<div className={cls.navigationContainer}>
					{!hideNavigation &&
						<NavigationMenu className={cls.noDragArea} />
					}
				</div>

				<div className={mergeClasses(cls.container, cls.noDragArea)}>
					{!hideNavigation && enableOpenApi &&
						<ApiDocsButton />
					}
					<UserCard hideUserInfo={simplifyNavigation} />
				</div>
			</header>
		</UserInfoProvider>
	);
}

const useStyles = makeStyles({
	header:
	{
		display: "flex",
		height: "64px",
		boxSizing: "border-box",
		gap: tokens.spacingHorizontalM,
		padding: `${tokens.spacingVerticalMNudge} ${tokens.spacingHorizontalL}`,
		alignItems: "center",
		"app-region": "drag",
		paddingRight: `calc(100% - env(titlebar-area-width, 100%) - env(titlebar-area-x, 0px) + ${tokens.spacingHorizontalL})`,
		paddingLeft: `calc(env(titlebar-area-x, 0px) + ${tokens.spacingHorizontalL})`
	},
	titleContainer:
	{
		display: "flex",
		gap: tokens.spacingHorizontalS,
		height: "100%",
		alignItems: "flex-end"
	},
	logo:
	{
		height: "38px"
	},
	title:
	{
		margin: 0,
		marginTop: "-4px",
		alignSelf: "center",
	},
	navigationContainer:
	{
		display: "flex",
		alignItems: "center",
		flexGrow: 1
	},
	container:
	{
		display: "flex",
		gap: tokens.spacingHorizontalMNudge,
		alignItems: "center"
	},
	noDragArea:
	{
		"app-region": "none"
	},
	drawerButton:
	{
		alignSelf: "center"
	}
});
