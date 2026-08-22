import { Avatar, Button, makeStyles, Menu, MenuDivider, MenuItem, MenuItemLink, MenuList, MenuPopover, MenuTrigger, Persona, type ButtonProps } from "@fluentui/react-components";
import { bundleIcon, SignOut20Filled, SignOut20Regular } from "@fluentui/react-icons";
import { sha256 } from "js-sha256";
import { useContext } from "react";
import { auth, type GetUserResponse } from "../api/auth";
import { UserInfoContext } from "../contexts/UserInfoContext";
import CurrentThemeIcon from "./CurrentThemeIcon";
import ThemeMenu from "./ThemeMenu";

export default function UserCard({ hideUserInfo, ...props }: UserCardProps): React.ReactElement
{
	const user = useContext<GetUserResponse>(UserInfoContext);
	const profileImage: string | undefined = getUserProfileImage(user);
	const cls = useStyles();

	return (
		<Menu positioning="below-end">
			<MenuTrigger disableButtonEnhancement>
				<Button appearance="subtle" className={cls.button} aria-label="profile" {...props}>
					{hideUserInfo ?
						<Avatar image={{ src: profileImage }} name={user.displayName} />
						:
						<Persona className={cls.persona}
							textAlignment="center"
							name={user.displayName}
							primaryText={user.displayName ?? user.subject}
							secondaryText={user.email}
							avatar={{ image: { src: profileImage } }} />
					}
				</Button>
			</MenuTrigger>

			<MenuPopover>
				<MenuList>
					<MenuItemLink icon={<SignOutIcon />} href={auth.getLogoutLink()}>
						Sign out
					</MenuItemLink>
					<MenuDivider />
					<ThemeMenu>
						<MenuItem icon={<CurrentThemeIcon />}>Theme</MenuItem>
					</ThemeMenu>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

const SignOutIcon = bundleIcon(SignOut20Filled, SignOut20Regular);

const useStyles = makeStyles({
	button:
	{
		minWidth: "unset"
	},
	persona:
	{
		maxWidth: "200px",
		whiteSpace: "nowrap",

		"& .fui-Persona__primaryText, .fui-Persona__secondaryText":
		{
			textOverflow: "ellipsis",
			overflow: "hidden",
			width: "100%",
			textAlign: "left"
		}
	}
});

function getUserProfileImage(userInfo: GetUserResponse): string | undefined
{
	if (userInfo.idpAvatar)
		return userInfo.idpAvatar;

	if (userInfo.email)
		return `https://gravatar.com/avatar/${sha256(userInfo.email)}`;

	return undefined;
}

export type UserCardProps = ButtonProps &
{
	hideUserInfo?: boolean;
};
