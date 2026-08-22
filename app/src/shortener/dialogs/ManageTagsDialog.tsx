import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, makeStyles, MessageBar, MessageBarBody, tokens } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import type { DialogProps } from "../../contexts/DialogContext";
import EditTag from "../components/EditTag";
import useShortener from "../hooks/useShortener";

export default function ManageTagsDialog({ close }: DialogProps): React.ReactElement
{
	const { tags } = useShortener();
	const [error, setError] = useState<string | null>(null);
	const [editId, setEditId] = useState<number | null>(null);

	const cls = useStyles();

	useEffect(() =>
	{
		setEditId(null);
	}, [tags]);

	return (
		<DialogSurface>
			<DialogBody>
				<DialogTitle>Manage tags</DialogTitle>

				<DialogContent className={cls.content}>
					<div className={cls.tags}>
						{tags.map(tag =>
							<EditTag key={tag.id} tag={tag}
								onEditStart={() => setEditId(tag.id)} onEditEnd={() => setEditId(null)}
								onError={setError}
								focused={editId === tag.id}
							/>
						)}
						{editId === 0 ?
							<EditTag focused onEditEnd={() => setEditId(null)} onError={setError} />
							:
							<Button
								size="small" appearance="subtle" icon={<AddRegular />}
								onClick={() => setEditId(0)}
							>
								New tag
							</Button>
						}
					</div>
					{error &&
						<MessageBar intent="error">
							<MessageBarBody>{error}</MessageBarBody>
						</MessageBar>
					}
				</DialogContent>

				<DialogActions>
					<Button appearance="primary" onClick={() => close()}>Done</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalL
	},
	tags:
	{
		display: "flex",
		rowGap: tokens.spacingHorizontalS,
		columnGap: tokens.spacingHorizontalS,
		flexWrap: "wrap"
	}
});
