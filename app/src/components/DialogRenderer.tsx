import { Dialog } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { DialogRendererContext, type DialogRendererContextType } from "../contexts/DialogContext";

export default function DialogRenderer(): React.ReactElement
{
	const { dialog, dismiss } = useContext<DialogRendererContextType>(DialogRendererContext);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => setOpen(true), [dialog]);

	function close(result: unknown): void
	{
		setOpen(false);
		setTimeout(() =>
		{
			dismiss();
			dialog?.resolve(result);
		}, 200);
	}

	if (!dialog)
		return <></>;

	return (
		<Dialog open={open} modalType={dialog.modalType} onOpenChange={() => close(dialog.defaultResult)}>
			<dialog.Component {...dialog.props} close={close} />
		</Dialog>
	);
}
