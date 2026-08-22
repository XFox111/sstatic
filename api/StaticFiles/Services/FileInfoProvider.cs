using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;

namespace SStatic.StaticFiles.Services;

/// <summary>
/// A service for providing file and directory information.
/// </summary>
public class FileInfoProvider(IServiceProvider serviceProvider)
{
	private readonly PhysicalFileProvider _fileProvider = serviceProvider.GetRequiredKeyedService<PhysicalFileProvider>("files");

	private readonly FileExtensionContentTypeProvider _extensionProvider = new();

	/// <summary>
	/// Gets the root path of the file provider.
	/// </summary>
	public string Root => _fileProvider.Root;

	/// <summary>
	/// Gets the full physical path of a file or directory.
	/// </summary>
	/// <param name="path">The path of the file or directory.</param>
	/// <returns>The full physical path of the file or directory.</returns>
	public string GetFullPath(string path) =>
		_fileProvider.GetFileInfo(path).PhysicalPath!;

	/// <summary>
	/// Gets the details of a file.
	/// </summary>
	/// <param name="path">The path of the file.</param>
	/// <returns>The details of the file.</returns>
	/// <exception cref="FileNotFoundException">Thrown when the file is not found.</exception>
	public FileDetails GetFileDetails(string path)
	{
		if (!File.Exists(path))
			throw new FileNotFoundException("File not found", path);

		string relativePath = Path.GetRelativePath(_fileProvider.Root, path);
		FileInfo fileInfo = new(path);

		if (!_extensionProvider.TryGetContentType(path, out string? mime))
			mime = "application/octet-stream";

		return new FileDetails
		{
			Name = fileInfo.Name,
			Path = NormalizePath(relativePath),
			Mime = mime,
			Size = fileInfo.Length,
			CreatedAt = fileInfo.CreationTime.ToUniversalTime(),
			UpdatedAt = fileInfo.LastWriteTime.ToUniversalTime()
		};
	}

	/// <summary>
	/// Gets the details of a directory.
	/// </summary>
	/// <param name="path">The path of the directory.</param>
	/// <param name="includeChildren">Whether to include the children of the directory.</param>
	/// <returns>The details of the directory.</returns>
	/// <exception cref="FileNotFoundException">Thrown when the directory is not found.</exception>
	public DirectoryDetails GetDirectoryDetails(string path, bool includeChildren = false)
	{
		if (!Directory.Exists(path))
			throw new FileNotFoundException("Directory not found", path);

		DirectoryInfo directoryInfo = new(path);
		string relativePath = Path.GetRelativePath(_fileProvider.Root, path);

		if (relativePath is ".")
			relativePath = string.Empty;

		object[]? children = null;

		if (includeChildren)
		{
			IDirectoryContents contents = _fileProvider.GetDirectoryContents(relativePath);
			children = [.. contents.Select(item => item.IsDirectory
				? (object)GetDirectoryDetails(item.PhysicalPath!, includeChildren: false)
				: GetFileDetails(item.PhysicalPath!))
			];
		}

		return new DirectoryDetails
		{
			Name = directoryInfo.Name,
			Path = NormalizePath(relativePath),
			CreatedAt = directoryInfo.CreationTime.ToUniversalTime(),
			UpdatedAt = directoryInfo.LastWriteTime.ToUniversalTime(),
			Children = children
		};
	}

	private static string NormalizePath(string path) =>
		path.Replace('\\', '/').TrimStart('/');
}
