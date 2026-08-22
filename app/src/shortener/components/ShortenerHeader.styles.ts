import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_ShortenerHeader = makeStyles({
	header:
	{
		display: "flex",
		gap: tokens.spacingHorizontalM,
		flexWrap: "wrap-reverse"
	},
	filters:
	{
		display: "flex",
		gap: tokens.spacingHorizontalMNudge,
		flexWrap: "wrap"
	},
	filterGroup:
	{
		display: "flex",
		flexGrow: 1,
		gap: tokens.spacingHorizontalMNudge
	},
	filterField:
	{
		flexGrow: 1
	},
	stateFilter:
	{
		minWidth: "160px"
	},
	actions:
	{
		display: "flex",
		flexGrow: 1,
		justifyContent: "flex-end",
		gap: tokens.spacingHorizontalMNudge
	}
});
