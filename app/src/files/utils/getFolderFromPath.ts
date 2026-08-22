import type { DirectoryDetails } from "../../api";

export default function getFolderFromPath(root: DirectoryDetails, path: string): DirectoryDetails
{
	if (root.path === path)
		return root;

	if (!path.startsWith(root.path))
		throw new Error(`Path "${path}" is not a child of root folder "${root.path}".`);

	if (!root.children)
		throw new Error(`Folder "${root.path}" has no children.`);

	const nextFolder = root.children.find(i => i.path === path || path.startsWith(i.path));

	if (!nextFolder)
		throw new Error(`No child folder of "${root.path}" matches path "${path}".`);

	return getFolderFromPath(nextFolder as DirectoryDetails, path);
}
