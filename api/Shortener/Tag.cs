using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SStatic.Shortener;

/// <summary>
/// A tag in the system.
/// </summary>
/// <example>
/// {
///   "id": 1,
///   "name": "My tag",
///   "color": "#2596be"
/// }
/// </example>
public record Tag
{
	/// <summary>
	/// The ID of the tag.
	/// </summary>
	public int Id { get; set; }

	/// <summary>
	/// The name of the tag.
	/// </summary>
	[StringLength(32, MinimumLength = 1)]
	public string Name { get; set; } = null!;

	/// <summary>
	/// The color of the tag as a number.
	/// </summary>
	[JsonIgnore]
	public int Color { get; set; }

	/// <summary>
	/// The color of the tag as a hexadecimal string.
	/// </summary>
	[JsonPropertyName("color")]
	[RegularExpression(@"^#[0-9a-fA-F]{6}$", ErrorMessage = "Color must be a valid hexadecimal color code (e.g. '#aabbcc').")]
	public string HexColor
	{
		get => $"#{Color:X6}";
		set
		{
			byte[] bytes = Convert.FromHexString(value[1..]);
			Color = bytes[0] << 16 | bytes[1] << 8 | bytes[2];
		}
	}
}
