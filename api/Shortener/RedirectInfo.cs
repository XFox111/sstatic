namespace SStatic.Shortener;

/// <summary>
/// Represents the redirect information for a short link.
/// </summary>
public record RedirectInfo(
	string Url,
	bool ForwardQuery,
	bool Found
);
