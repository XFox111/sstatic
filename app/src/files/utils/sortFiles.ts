import type { DirectoryChild } from "../../api";

export default function sortFiles(files: DirectoryChild[], sortBy: SortByKey, order: OrderKey): DirectoryChild[]
{
	const direction = order === "asc" ? 1 : -1;

	return files.sort((a, b) =>
	{
		// Keep directories grouped.
		if (a.type !== b.type)
		{
			if (order === "asc")
				return a.type === "directory" ? -1 : 1;
			else
				return a.type === "directory" ? 1 : -1;
		}

		let comparison = 0;

		switch (sortBy)
		{
			case "name":
				comparison = a.name.localeCompare(b.name);
				break;

			case "updatedAt":
				comparison =
					new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
				break;

			case "size": {
				const sizeA = a.type === "file" ? a.size : 0;
				const sizeB = b.type === "file" ? b.size : 0;

				comparison = sizeA - sizeB;

				// Tie-break by name.
				if (comparison === 0)
					comparison = a.name.localeCompare(b.name);

				break;
			}
		}

		return comparison * direction;
	});
}

export type SortByKey = "name" | "updatedAt" | "size";
export type OrderKey = "asc" | "desc";
