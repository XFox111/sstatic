import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_FolderView = makeStyles({
	article:
	{
		flexGrow: 1,
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS,
		overflow: "auto"
	},
	header:
	{
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	navigation:
	{
		flexGrow: 1,
		display: "flex",
		alignItems: "center",
		gap: tokens.spacingHorizontalXXS,
		overflow: "auto"
	},
	breadcrumbs:
	{
		overflow: "auto"
	},
	content:
	{
		overflow: "auto",
		backgroundColor: tokens.colorNeutralBackground1,
		borderRadius: tokens.borderRadiusMedium,
		border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`
	},
	emptyContainer:
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
		zIndex: 1
	},
	row:
	{
		display: "grid",
		gridTemplateColumns: "auto 1fr 160px 120px",

		"@media screen and (max-width: 768px)":
		{
			gridTemplateColumns: "auto 1fr 160px",

			"& div[role=gridcell]:nth-child(4), div[role=columnheader]:nth-child(4)":
			{
				display: "none"
			}
		},

		"@media screen and (max-width: 640px)":
		{
			gridTemplateColumns: "auto 1fr !important",

			"& div[role=gridcell]:nth-child(3), div[role=columnheader]:nth-child(3)":
			{
				display: "none"
			}
		}
	}
});
