using SStatic.Analytics.Configuration;
using SStatic.Analytics.Plausible;
using SStatic.Analytics.Services;
using SStatic.Analytics.Webhook;
using UAParser;

namespace SStatic.Analytics;

/// <summary>
/// Web application builder extensions for analytics services.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Add and configure analytics services that URL visits can be reported to.
	/// </summary>
	public static IServiceCollection AddAnalytics(this IServiceCollection services, IConfigurationSection configuration)
	{
		AnalyticsConfig? analyticsConfig = configuration.Get<AnalyticsConfig>();

		if (analyticsConfig?.Plausible is not null)
			services
				.AddSingleton(analyticsConfig.Plausible)
				.AddScoped<IAnalyticsProvider, PlausibleAnalyticsProvider>();

		if (analyticsConfig?.Webhook is not null)
			services
				.AddSingleton(analyticsConfig.Webhook)
				.AddScoped<GeoIpService>()
				.AddSingleton(_ => Parser.GetDefault())
				.AddScoped<IAnalyticsProvider, WebhookAnalyticsProvider>();

		return services;
	}
}
