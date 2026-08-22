import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_LinksTable = makeStyles({
	spinner:
	{
		height: "140px"
	},
	empty:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "140px",
		boxSizing: "border-box",
		gap: tokens.spacingVerticalL,
		padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
		color: tokens.colorNeutralForeground3
	},
	tableHeader:
	{
		position: "sticky",
		top: 0,
		backgroundColor: tokens.colorNeutralBackground1,
		zIndex: 1,

		"& th::after":
		{
			content: "''",
			position: "absolute",
			bottom: "-1px",
			left: 0,
			width: "100%",
			height: "1px",
			backgroundColor: tokens.colorNeutralStroke2
		}
	},
	statusHeader: { width: "64px" },
	statusCell: { justifyContent: "center" },
	timeHeader: { width: "140px" },
	tagsHeader: { width: "240px" },
	visitsHeader: { width: "96px" },
	actionsHeader: { width: "64px" },
	actionsHeaderExpanded: { width: "96px" },
	tagsCell:
	{
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
		height: "unset",
		minHeight: "44px",
		boxSizing: "border-box",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
		gap: tokens.spacingHorizontalXS
	},
	urlCell:
	{
		"& .fui-TableCellLayout__content":
		{
			overflow: "hidden"
		},

		"& .fui-TableCellLayout__main":
		{
			display: "flex",
			alignItems: "center",
			gap: tokens.spacingHorizontalXXS,
			overflow: "hidden"
		},

		"& a":
		{
			textOverflow: "ellipsis"
		}
	},
	popoverSurface:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalXS,
		alignItems: "flex-start",
		overlfow: "hidden",

		"& a":
		{
			overflowWrap: "anywhere"
		}
	},
	popoverRow:
	{
		display: "flex",
		gap: tokens.spacingHorizontalS,
		alignItems: "center",
		minHeight: "24px"
	},
	tagsContainer:
	{
		display: "flex",
		flexFlow: "row wrap",
		gap: tokens.spacingHorizontalXS,
		marginTop: tokens.spacingVerticalS
	},
	hidden:
	{
		display: "none"
	}
});
