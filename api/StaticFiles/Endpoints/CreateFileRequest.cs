using System.ComponentModel.DataAnnotations;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A request to create a new item.
/// </summary>
/// <example>{"name":"projects"}</example>
/// <param name="Name">The name of the new item to create.</param>
/// <param name="Type">The type of the new item to create.</param>
public record CreateFileRequest(
	[property: RegularExpression(@"^[^/\\<>:""|?*\x00-\x1F]*[^/\\<>:""|?*\x00-\x1F\s.]$", ErrorMessage = "Invalid file name.")]
	[property: StringLength(260, MinimumLength = 1)]
	string Name,
	ItemType Type
);
