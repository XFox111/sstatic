import { makeStyles, Spinner } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { getRuntimeInfo, type GetRuntimeInfoResponse } from "../api/getRuntimeInfo";
import RuntimeInfoContext from "../contexts/RuntimeInfoContext";

export default function RuntimeInfoProvider({ children }: RuntimeInfoProviderProps): React.ReactElement
{
	const [runtimeInfo, setRuntimeInfo] = useState<GetRuntimeInfoResponse>(null!);
	const cls = useStyles();

	useEffect(() =>
	{
		async function fetchInfo(): Promise<void>
		{
			const [success, result] = await getRuntimeInfo();

			if (success)
				setRuntimeInfo(result);
			else
				document.location.reload();
		}

		fetchInfo();
	}, []);

	if (runtimeInfo === null)
		return <Spinner size="huge" className={cls.spinner} />;

	return (
		<RuntimeInfoContext.Provider value={{
			...runtimeInfo,
			filesBaseUrl: getUrl(runtimeInfo.files.host, runtimeInfo.files.prefix),
			shortenerBaseUrl: getUrl(runtimeInfo.shortener.host, runtimeInfo.shortener.prefix)
		}}>
			{typeof children === "function"
				? children(runtimeInfo)
				: children
			}
		</RuntimeInfoContext.Provider>
	);
}

function getUrl(host: string, prefix: string): string
{
	let url: string = !host || host === "*"
		? window.location.host
		: host;

	url += "/";

	prefix = prefix.replaceAll(/(^\/+)|(\/+$)/g, "");

	if (prefix)
		url += prefix + "/";

	return url;
}

const useStyles = makeStyles({
	spinner:
	{
		width: "100%",
		height: "100vh"
	}
});

export type RuntimeInfoProviderProps =
	{
		children?: React.ReactNode | ((props: GetRuntimeInfoResponse) => React.ReactElement);
	};
