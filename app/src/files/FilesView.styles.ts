import { makeStyles, tokens } from "@fluentui/react-components";


export const useStyles_FilesView = makeStyles({
	statusWrap:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: tokens.spacingVerticalM,
		padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalL}`,
		color: tokens.colorNeutralForeground3
	},
	root:
	{
		display: "flex",
		flexFlow: "column",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
		gap: tokens.spacingVerticalS,
		height: "100%",
		overflow: "auto",
		boxSizing: "border-box"
	},
	columnWrap:
	{
		display: "flex",
		gap: tokens.spacingHorizontalMNudge,
		overflow: "auto",
		height: "100%"
	},
	errorBar:
	{
		margin: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalS}`,
	},
	sidebar:
	{
		display: "grid",
		clipPath: "content-box",
		borderRadius: tokens.borderRadius2XLarge,
		width: "300px",
		overflow: "auto"
	}
});
