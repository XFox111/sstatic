namespace SStatic.StaticFiles;

/// <summary>
/// The details of a file.
/// </summary>
/// <example>
/// {
///   "name": "example.txt",
///   "path": "path/to/example.txt",
///   "size": 1024,
///   "createdAt": "2023-01-01T00:00:00Z",
///   "updatedAt": "2023-01-01T00:00:00Z",
///   "type": "file"
/// }
/// </example>
public record FileDetails : IDirectoryChild
{
	/// <inheritdoc />
	public ItemType Type { get; } = ItemType.File;

	/// <inheritdoc />
	public required string Name { get; init; }

	/// <inheritdoc />
	public required string Path { get; init; }

	/// <inheritdoc />
	public required DateTime CreatedAt { get; init; }

	/// <inheritdoc />
	public required DateTime UpdatedAt { get; init; }

	/// <summary>
	/// The size of the file.
	/// </summary>
	public required long Size { get; init; }

	/// <summary>
	/// The detected MIME-type of the file.
	/// </summary>
	public required string Mime { get; init; }
}
