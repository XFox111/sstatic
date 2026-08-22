import { createContext } from "react";
import type { PromptDialogProps } from "../providers/DialogProvider";
import type { DialogModalType } from "@fluentui/react-components";

export default createContext<DialogContextType>(null!);
export const DialogRendererContext = createContext<DialogRendererContextType>(null!);

export type DialogContextType =
	{
		pushCustom<TProps extends object, TResult>(
			dialog: React.FC<DialogProps<TProps, TResult>>,
			props: TProps,
			modalType?: DialogModalType,
			defaultResult?: TResult
		): Promise<TResult>,
		pushPrompt(props: PromptDialogProps, modalType?: DialogModalType, defaultResult?: boolean): Promise<boolean>;
	};

export type DialogProps<TProps extends object = object, TResult = void> = TProps &
{
	close(result: TResult): void;
};

export type DialogRendererContextType =
	{
		dialog: DialogRendererProps | null;
		dismiss(): void;
	};

export type DialogRendererProps =
	{
		Component: React.FC<DialogProps<object, unknown>>,
		props: object;
		resolve: (value: unknown) => void;
		modalType?: DialogModalType;
		defaultResult?: unknown;
	};
