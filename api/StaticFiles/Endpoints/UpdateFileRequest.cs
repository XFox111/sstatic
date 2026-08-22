using System.ComponentModel.DataAnnotations;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A request to update a file or directory.
/// </summary>
/// <example>{"content":"Hello, World!"}</example>
/// <example>{"destination":"path/to/file.txt",}</example>
/// <param name="Destination">The destination path of the file or directory to update.</param>
/// <param name="Content">The content to update the file with.</param>
public record UpdateFileRequest(
	[property: RegularExpression(@"^[^\\<>:""|?*\x00-\x1F]*[^/\\<>:""|?*\x00-\x1F\s.]$", ErrorMessage = "Invalid path.")]
	string? Destination,
	string? Content
);
