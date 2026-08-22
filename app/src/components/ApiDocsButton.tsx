import { Button } from "@fluentui/react-components";
import { Open20Regular } from "@fluentui/react-icons";

const ApiDocsButton: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = props =>
	<Button
		appearance="subtle" icon={<Open20Regular />}
		as="a" href="scalar" target="_blank"
		{...props}
	>
		API docs
	</Button>;

export default ApiDocsButton;
