export default function preventPageUnload(): PreventPageUnloadHandler
{
	const onBeforeUnloadHandler = (event: BeforeUnloadEvent): void =>
	{
		event.preventDefault();
		event.returnValue = true;
	};

	window.addEventListener("beforeunload", onBeforeUnloadHandler);

	return {
		release: () => window.removeEventListener("beforeunload", onBeforeUnloadHandler)
	};
}

export type PreventPageUnloadHandler =
	{
		release(): void;
	};
