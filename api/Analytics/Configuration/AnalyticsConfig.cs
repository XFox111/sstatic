using SStatic.Analytics.Plausible;
using SStatic.Analytics.Webhook;

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

	/// <summary>
	/// Configuration for reporting analytics to a webhook.
	/// </summary>
	public WebhookConfig? Webhook { get; set; } = null;
}
