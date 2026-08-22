using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SStatic.Shortener;

/// <summary>
/// A short link in the system.
/// </summary>
/// <example>
/// {
///   "slug": "my-link",
///   "redirectUrl": "https://example.com",
///   "forwardQuery": false,
///   "isEnabled": true,
///   "tags": [],
///   "createdAt": "2024-01-01T00:00:00Z",
///   "updatedAt": "2024-01-01T00:00:00Z",
///   "visits": 15
/// }
/// </example>
public record ShortLink
{
	/// <summary>
	/// The internal id of the short link.
	/// </summary>
	[JsonIgnore]
	public int Id { get; set; }

	/// <summary>
	/// The slug of the short link.
	/// </summary>
	[RegularExpression(@"^[a-zA-Z0-9-_.]+$", ErrorMessage = "Slug can only contain letters, numbers, hyphens, underscores, and periods.")]
	public string Slug { get; set; } = null!;

	/// <summary>
	/// The URL to redirect to.
	/// </summary>
	public Uri RedirectUrl { get; set; } = null!;

	/// <summary>
	/// Whether to forward the query string from the short link to the redirect URL.
	/// </summary>
	public bool ForwardQuery { get; set; } = false;

	/// <summary>
	/// Whether the short link is enabled.
	/// </summary>
	public bool IsEnabled { get; set; } = true;

	/// <summary>
	/// The tags associated with the short link.
	/// </summary>
	public virtual ICollection<Tag> Tags { get; set; } = null!;

	/// <summary>
	/// The date and time when the short link was created.
	/// </summary>
	public DateTime CreatedAt
	{
		get => field.ToUniversalTime();
		set;
	} = DateTime.UtcNow;

	/// <summary>
	/// The date and time when the short link was last updated.
	/// </summary>
	public DateTime UpdatedAt
	{
		get => field.ToUniversalTime();
		set;
	} = DateTime.UtcNow;

	/// <summary>
	/// Number of times the URL was visited.
	/// </summary>
	public int Visits { get; set; } = 0;
}
