import { Button, Toast, ToastBody, ToastFooter, ToastTitle, ToastTrigger, useToastController } from "@fluentui/react-components";
import { ArrowClockwise20Regular, Dismiss20Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { auth, type GetUserResponse } from "../api/auth";
import { UserInfoContext } from "../contexts/UserInfoContext";

export default function UserInfoProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const [userInfo, setUserInfo] = useState<GetUserResponse>({ subject: "" });
	const toaster = useToastController();

	useEffect(() =>
	{
		async function fetchUser(): Promise<void>
		{
			const [success, result] = await auth.getUserInfo();

			if (success)
				setUserInfo(result);
			else
				toaster.dispatchToast(
					<Toast>
						<ToastTitle
							action={
								<ToastTrigger>
									<Button appearance="subtle" aria-label="dismiss" icon={<Dismiss20Regular />} />
								</ToastTrigger>
							}
						>
							Failed to fetch user info
						</ToastTitle>
						<ToastBody>{result.detail || result.title}</ToastBody>
						<ToastFooter>
							<Button icon={<ArrowClockwise20Regular />}>Refresh page</Button>
						</ToastFooter>
					</Toast>,
					{ intent: "error", timeout: -1 }
				);
		}

		fetchUser();
	}, [toaster]);

	return (
		<UserInfoContext.Provider value={userInfo}>
			{children}
		</UserInfoContext.Provider>
	);
}
