import { useState } from "react";
import DialogContext, { DialogRendererContext, type DialogProps, type DialogRendererProps } from "../contexts/DialogContext";
import PromptDialog from "../dialogs/PromptDialog";
import type { DialogModalType } from "@fluentui/react-components";

export default function DialogProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const [dialog, setDialog] = useState<DialogRendererProps | null>(null);

	function pushCustom<TProps extends object = object, TResult = void>(
		dialog: React.FC<DialogProps<TProps, TResult>>,
		props: TProps,
		modalType?: DialogModalType,
		defaultResult?: TResult
	): Promise<TResult>
	{
		return new Promise<TResult>(resolve =>
			setDialog({
				Component: dialog, props, resolve, modalType, defaultResult
			} as unknown as DialogRendererProps)
		);
	}

	function pushPrompt(props: PromptDialogProps, modalType?: DialogModalType): Promise<boolean>
	{
		return pushCustom(PromptDialog, props, modalType, false);
	}

	return (
		<DialogContext.Provider value={{ pushCustom, pushPrompt }}>
			<DialogRendererContext.Provider value={{ dialog, dismiss: () => setDialog(null) }}>
				{children}
			</DialogRendererContext.Provider>
		</DialogContext.Provider>
	);
}

export type PromptDialogProps =
	{
		title: string;
		content: React.ReactNode;
		confirmText: string;
		cancelText?: string;
		destructive?: boolean;
		onConfirm?: (setError: (error: string) => void) =>
			void | boolean | Promise<void> | Promise<boolean>;
	};
