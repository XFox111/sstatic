import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_EditTag = makeStyles({
	tag_media:
	{
		paddingLeft: 0
	},
	badge:
	{
		cursor: "pointer",
		width: "32px",
		height: "32px",
		boxSizing: "border-box",
		margin: "-1px",
		border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`
	},
	colorInput:
	{
		width: "0px",
		height: "0px",
		border: "none",
		padding: "0px",
	},
	secondaryButton:
	{
		borderRadius: 0,
		borderRight: "none"
	},
	secondaryButton_disabled:
	{
		backgroundColor: `${tokens.colorNeutralBackground1} !important`,
		color: `${tokens.colorNeutralForegroundDisabled} !important`,
		cursor: "not-allowed !important"
	},
	input:
	{
		backgroundColor: "transparent",
		border: "none",
		outline: "none",
		fontSize: tokens.fontSizeBase300,
		fontFamily: tokens.fontFamilyBase,
		width: "100px",
		color: tokens.colorNeutralForeground1
	}
});
