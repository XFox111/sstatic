export default function draggingFiles(event: DragEvent): boolean
{
	return [...event.dataTransfer!.items].some(item => item.kind === "file");
}
