using System.ComponentModel.DataAnnotations;

namespace SStatic.Shortener.Endpoints.Tags;

/// <summary>
/// A request to create or update a tag.
/// </summary>
/// <example>{"name": "My tag", "color": "#2596be"}</example>
/// <param name="Name">The name of the tag.</param>
/// <param name="Color">The color of the tag in hex.</param>
public record UpdateTagRequest(
	[property: StringLength(32, MinimumLength = 1)]
	string Name,
	[property: RegularExpression(@"^#[0-9a-fA-F]{6}$", ErrorMessage = "Color must be a valid hexadecimal color code (e.g. '#aabbcc').")]
	string Color
);
