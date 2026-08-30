using SStatic.Analytics.Plausible;

namespace SStatic.Analytics.Configuration;

/// <summary>
/// URL shortener analytics configuration.
/// </summary>
public class AnalyticsConfig
{
	/// <summary>
	/// Configuration for Plausible analytics service.
	/// </summary>
	public PlausibleConfig? Plausible { get; set; } = null;
}
