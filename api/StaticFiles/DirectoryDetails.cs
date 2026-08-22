namespace SStatic.StaticFiles;

/// <summary>
/// The details of a directory.
/// </summary>
/// <example>
/// {
///   "name": "example",
///   "path": "path/to/example",
///   "createdAt": "2023-01-01T00:00:00Z",
///   "updatedAt": "2023-01-01T00:00:00Z",
///   "children": [],
///   "type": "directory"
/// }
/// </example>
public record DirectoryDetails : IDirectoryChild
{
	/// <inheritdoc />
	public ItemType Type { get; } = ItemType.Directory;

	/// <inheritdoc />
	public required string Name { get; init; }

	/// <inheritdoc />
	public required string Path { get; init; }

	/// <inheritdoc />
	public required DateTime CreatedAt { get; init; }

	/// <inheritdoc />
	public required DateTime UpdatedAt { get; init; }

	/// <summary>
	/// The children of the directory. <c>null</c> if presented as a child.
	/// </summary>
	public object[]? Children { get; init; }
}
