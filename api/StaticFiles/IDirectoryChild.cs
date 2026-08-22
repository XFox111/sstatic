namespace SStatic.StaticFiles;

/// <summary>
/// The interface for a directory child.
/// </summary>
public interface IDirectoryChild
{
	/// <summary>
	/// Gets the type of the directory child.
	/// </summary>
	public ItemType Type { get; }

	/// <summary>
	/// The name of the file.
	/// </summary>
	public string Name { get; }

	/// <summary>
	/// The path of the file.
	/// </summary>
	public string Path { get; }

	/// <summary>
	/// The creation time of the file.
	/// </summary>
	public DateTime CreatedAt { get; }

	/// <summary>
	/// The last update time of the file.
	/// </summary>
	public DateTime UpdatedAt { get; }
}
