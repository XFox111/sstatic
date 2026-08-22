using SStatic.Analytics.Configuration;
using SStatic.Analytics.Plausible;
using SStatic.Analytics.Services;

namespace SStatic.Analytics;

/// <summary>
/// Web application builder extensions for analytics services.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Add and configure analytics services that URL visits can be reported to.
	/// </summary>
	public static IServiceCollection AddAnalytics(this IServiceCollection services, ConfigurationManager configuration)
	{
		AnalyticsConfig? analyticsConfig = configuration.GetSection("Analytics").Get<AnalyticsConfig>();

		if (analyticsConfig is not null)
			services.AddScoped<GeoIpService>();

		if (analyticsConfig?.Plausible is not null)
			services
				.AddSingleton(analyticsConfig.Plausible)
				.AddScoped<IAnalyticsProvider, PlausibleAnalyticsProvider>();

		return services;
	}
}