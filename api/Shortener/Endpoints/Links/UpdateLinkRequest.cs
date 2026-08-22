using System.ComponentModel.DataAnnotations;

namespace SStatic.Shortener.Endpoints.Links;

/// <summary>
/// Request model for updating or creating a short link.
/// </summary>
/// <param name="Slug">The slug of the short link.</param>
/// <param name="RedirectUrl">The URL to redirect to.</param>
/// <param name="ForwardQuery">Whether to forward the query string from the short link to the redirect URL.</param>
/// <param name="IsEnabled">Whether the short link is enabled.</param>
/// <param name="ResetVisits">Whether the visits coutner should be reset to 0.</param>
/// <param name="Tags">The tags associated with the short link.</param>
public record UpdateLinkRequest(
	[property: RegularExpression(@"^[a-zA-Z0-9-_.]+$", ErrorMessage = "Slug can only contain letters, numbers, hyphens, underscores, and periods.")]
	string Slug,
	Uri RedirectUrl,
	bool ForwardQuery,
	bool IsEnabled,
	bool ResetVisits,
	Tag[] Tags
);
