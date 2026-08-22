import { Toast, ToastTitle, type ToastProps } from "@fluentui/react-components";

const UrlCopiedToast: React.FC<ToastProps> = props =>
	<Toast {...props}>
		<ToastTitle>URL copied to clipboard</ToastTitle>
	</Toast>;

export default UrlCopiedToast;
