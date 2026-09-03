import { Body1, Button, LargeTitle, Link, Subtitle1, Tooltip, type ButtonProps } from "@fluentui/react-components";
import { Person20Regular } from "@fluentui/react-icons";
import { useMemo } from "react";
import { auth } from "../api";
import ApiDocsButton from "../components/ApiDocsButton";
import CurrentThemeIcon from "../components/CurrentThemeIcon";
import ThemeMenu from "../components/ThemeMenu";
import LoginDialog from "../dialogs/LoginDialog";
import useDialog from "../hooks/useDialog";
import useRuntimeInfo from "../hooks/useRuntimeInfo";
import { useStyles_LoginPage } from "./LoginPage.styles";
import DialogRenderer from "../components/DialogRenderer";
import useTheme from "../hooks/useTheme";

export default function LoginPage(): React.ReactElement
{
	const { isDark } = useTheme();
	const { enableOpenApi, usePasswordAuth } = useRuntimeInfo();
	const dialog = useDialog();
	const cls = useStyles_LoginPage();

	const loginButtonProps: ButtonProps = useMemo(
		() => usePasswordAuth
			? { as: "button", onClick: () => dialog.pushCustom(LoginDialog, {}) }
			: { as: "a", href: auth.getLoginLink() },
		[dialog, usePasswordAuth]
	);

	return (
		<main className={cls.main}>
			<header className={cls.header}>
				<div className={cls.headerContent}>
					{enableOpenApi &&
						<ApiDocsButton />
					}
					<ThemeMenu>
						<Tooltip relationship="label" content="Switch theme">
							<Button appearance="subtle" icon={<CurrentThemeIcon />} />
						</Tooltip>
					</ThemeMenu>
					<Button appearance="primary" icon={<Person20Regular />} {...loginButtonProps}>
						Sign in
					</Button>
				</div>
			</header>

			<article className={cls.content}>
				<img src={"./logo.svg" + (isDark ? "#dark" : "#light")} alt="" className={cls.logo} />
				<LargeTitle align="center">Welcome to sstatic!</LargeTitle>
				<Subtitle1 align="center">
					sstatic is a simple self-hosted application for serving static files with built-in URL shortener.
				</Subtitle1>

				<div>
					{link("Documentation", "https://sstatic.xfox111.net/")} {" | "}
					{link("GitHub", "https://github.com/XFox111/sstatic")} {" | "}
					{link("Buy Me a Coffee", "https://buymeacoffee.com/xfox111")}
				</div>
			</article>

			<footer className={cls.footer}>
				<div className={cls.footerContent}>
					<Body1 className={cls.footerText}>
						Developed by {link("Eugene Fox", "https://xfox111.net")}<br />
						Licensed under {link("MIT", "https://github.com/XFox111/sstatic/blob/main/LICENSE")}
					</Body1>
					<img src="footer.svg" />
				</div>
			</footer>

			<DialogRenderer />
		</main>
	);
}

const link = (text: string, url: string): React.ReactElement =>
	<Link href={url} target="_blank">{text}</Link>;
