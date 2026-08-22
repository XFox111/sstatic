namespace SStatic.Analytics.Plausible;

/// <summary>
/// Configuration for Plausible analytics.
/// </summary>
public class PlausibleConfig
{
	/// <summary>
	/// Domain name key to report visits for.
	/// </summary>
	/// <remarks>Usually, the same as your SStatic instance URL shortener domain name.</remarks>
	public string DomainName { get; set; } = null!;

	/// <summary>
	/// HTTP endpoint for Plausible service to report visits to.
	/// </summary>
	/// <value><c>https://plausible.io/api/event</c> (default)</value>
	public string Endpoint { get; set; } = "https://plausible.io/api/event";
}