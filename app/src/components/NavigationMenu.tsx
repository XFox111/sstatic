import { Tab, TabList, type SelectTabData, type SelectTabEvent, type TabListProps } from "@fluentui/react-components";
import { bundleIcon, CloudLink20Filled, CloudLink20Regular, DocumentLink20Filled, DocumentLink20Regular } from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router";

export default function NavigationMenu(props: TabListProps): React.ReactElement
{
	const location = useLocation();
	const navigate = useNavigate();

	function onTabSelect(event: SelectTabEvent, data: SelectTabData): void
	{
		navigate(data.value!);
		props.onTabSelect?.(event, data);
	};

	return (
		<TabList
			selectedValue={location.pathname.split("/")[1] || "dashboard"} {...props}
			onTabSelect={onTabSelect}
		>
			<Tab icon={<ShortenerIcon />} value="shortener">URL shortener</Tab>
			<Tab icon={<StaticIcon />} value="files">Static files</Tab>
		</TabList>
	);
}

const StaticIcon = bundleIcon(DocumentLink20Filled, DocumentLink20Regular);
const ShortenerIcon = bundleIcon(CloudLink20Filled, CloudLink20Regular);
