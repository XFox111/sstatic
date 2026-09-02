namespace SStatic.Shortener.Configuration;

/// <summary>
/// Shortener component configuration.
/// </summary>
public class ShortenerConfig
{
	/// <summary>
	/// The host for the shortener service.
	/// </summary>
	public string Host { get; set; } = "*";

	/// <summary>
	/// The prefix for the shortener service.
	/// </summary>
	public string Prefix { get; set; } = "/";

	/// <summary>
	/// Whether short links are case-insensitive.
	/// </summary>
	public bool CaseInsensitiveSlugs { get; set; } = false;

	/// <summary>
	/// Default length for random short URL slugs.
	/// </summary>
	public int DefaultSlugLength { get; set; } = 8;
}
