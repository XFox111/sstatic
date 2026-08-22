import { Button, ToastTrigger, Tooltip } from "@fluentui/react-components";
import { Dismiss16Regular } from "@fluentui/react-icons";

const ToastDismissButton: React.FC = () =>
	<ToastTrigger>
		<Tooltip relationship="label" content="Dismiss">
			<Button appearance="subtle" size="small" icon={<Dismiss16Regular />} />
		</Tooltip>
	</ToastTrigger>;

export default ToastDismissButton;
