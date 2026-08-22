import type { DirectoryDetails } from "../../api";

export default function replaceFolderInTree(root: DirectoryDetails, folder: DirectoryDetails): DirectoryDetails
{
	if (root.path === folder.path)
		return folder;

	if (!folder.path.startsWith(root.path))
		return root;

	if (!root.children)
		return root;

	return {
		...root,
		children: root.children.map(i => replaceFolderInTree(i as DirectoryDetails, folder))
	};
}
