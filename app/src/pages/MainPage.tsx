import { makeStyles, Toaster, tokens } from "@fluentui/react-components";
import Header from "../components/Header";

export default function MainPage({ children }: React.PropsWithChildren): React.ReactElement
{
	const cls = useStyles();

	return (
		<main className={cls.main}>
			<Header />
			<div className={cls.content}>
				{children}
			</div>
			<Toaster pauseOnHover pauseOnWindowBlur />
		</main>
	);
}

const useStyles = makeStyles({
	main:
	{
		height: "100vh",
		display: "flex",
		flexFlow: "column",
		overflow: "auto"
	},
	content:
	{
		flexGrow: 1,
		backgroundColor: tokens.colorNeutralBackground2,
		borderTopLeftRadius: tokens.borderRadius4XLarge,
		borderTopRightRadius: tokens.borderRadius4XLarge,
		overflow: "auto"
	}
});
