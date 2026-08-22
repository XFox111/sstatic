import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_LoginPage = makeStyles({
	main:
	{
		minHeight: "100vh",
		display: "flex",
		flexFlow: "column"
	},
	header:
	{
		display: "flex",
		justifyContent: "flex-end",
		padding: `${tokens.spacingVerticalMNudge} ${tokens.spacingHorizontalL}`,
		paddingRight: `calc(100% - env(titlebar-area-width, 100%) + ${tokens.spacingHorizontalL})`,
		"app-region": "drag"
	},
	headerContent:
	{
		display: "flex",
		gap: tokens.spacingHorizontalS,
		"app-region": "none"
	},
	content:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		flexGrow: 1,
		gap: tokens.spacingVerticalL,
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,

		"& a":
		{
			whiteSpace: "nowrap"
		}
	},
	logo:
	{
		height: "128px"
	},
	footer:
	{
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "end"
	},
	footerContent:
	{
		position: "relative",
		width: "100%",
		maxWidth: "400px"
	},
	footerText:
	{
		position: "absolute",
		top: "24px",
		left: "72px"
	}
});
