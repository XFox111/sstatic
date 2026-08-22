import type { DirectoryDetails } from "../../api";

export default function getDirectoriesFromPath(currentDirectory: DirectoryDetails, root: DirectoryDetails): DirectoryDetails[]
{
	if (currentDirectory.path === root.path)
		return [root];

	if (!currentDirectory.path.startsWith(root.path))
		return [root];

	const parts: string[] = currentDirectory.path.split("/");
	const directories: DirectoryDetails[] = [root];

	let current: DirectoryDetails = root;

	for (const part of parts)
	{
		const next = current.children!.find(i => i.type === "directory" && i.name === part) as DirectoryDetails;
		directories.push(next);
		current = next;
	}

	return directories;
}
