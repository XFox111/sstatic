export default async function pickFiles(): Promise<FileList | null>
{
	const element: HTMLInputElement = document.createElement("input");
	element.style.display = "none";
	element.hidden = true;
	element.multiple = true;
	element.type = "file";

	document.body.appendChild(element);
	element.click();

	await new Promise<void>(resolve =>
	{
		function listener(): void
		{
			element.removeEventListener("input", listener);
			resolve();
		}

		element.addEventListener("input", listener);
	});

	if (!element.files || element.files.length < 1)
		return null;

	document.body.removeChild(element);
	return element.files;
}
