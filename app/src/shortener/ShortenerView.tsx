import { Button, makeStyles, MessageBar, MessageBarBody, tokens } from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import { type ReactElement, useEffect, useMemo, useState } from "react";
import DialogRenderer from "../components/DialogRenderer";
import LinksTable from "./components/LinksTable";
import ShortenerHeader from "./components/ShortenerHeader";
import useShortener from "./hooks/useShortener";
import ShortenerProvider from "./providers/ShortenerProvider";
import type { ShortenerFilters } from "./utils/applyFilters";

function ShortenerView(): ReactElement
{
	const { links, error, isLoading, createLink } = useShortener();
	const [filters, setFilters] = useState<ShortenerFilters>({ state: "all", tags: [] });

	const showCatchAll: boolean = useMemo(
		() => !isLoading && links.every(i => i.slug !== "_catch-all"),
		[links, isLoading]
	);

	const cls = useStyles();

	useEffect(() =>
	{
		document.title = "URL shortener - sstatic";
	}, []);

	return (
		<article className={cls.article}>
			<ShortenerHeader filters={filters} onFilterUpdated={setFilters} />

			{error &&
				<MessageBar intent="error">
					<MessageBarBody>{error}</MessageBarBody>
				</MessageBar>
			}

			<div className={cls.tableWrap}>
				<LinksTable filters={filters} onFilterUpdated={setFilters} />
				{showCatchAll &&
					<Button
						appearance="subtle" icon={<Add20Regular />}
						className={cls.catchAllButton}
						onClick={() => createLink({ suggestedSlug: "_catch-all" })}
					>
						Add catch-all redirect
					</Button>
				}
			</div>
			<DialogRenderer />
		</article>
	);
}

export default function ShortenerViewWrapper(): React.ReactElement
{
	return (
		<ShortenerProvider>
			<ShortenerView />
		</ShortenerProvider>
	);
}

const useStyles = makeStyles({
	article:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalMNudge,
		padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
		height: "100%",
		boxSizing: "border-box"
	},
	tableWrap:
	{
		overflowY: "auto",
		backgroundColor: tokens.colorNeutralBackground1,
		borderRadius: tokens.borderRadiusLarge,
		border: `1px solid ${tokens.colorNeutralStroke2}`,
		maxHeight: "100%"
	},
	catchAllButton:
	{
		width: "100%",
		justifyContent: "flex-start"
	}
});
