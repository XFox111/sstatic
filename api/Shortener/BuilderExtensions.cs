using Microsoft.Extensions.FileProviders;
using SStatic.Shortener.Services;

namespace SStatic.Shortener;

/// <summary>
/// URL shortener extensions for application builder.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Schedule a link files cleanup task to perform upon application startup.
	/// </summary>
	public static void RunLinksCleanup(this WebApplication app) =>
		app.Lifetime.ApplicationStarted.Register(() =>
		{
			using IServiceScope scope = app.Services.CreateScope();
			ShortenerService shortenerService = scope.ServiceProvider.GetRequiredService<ShortenerService>();
			shortenerService.SynchronizeLinkFilesAsync().Wait();
		});

	/// <summary>
	/// Add URL shortener services.
	/// </summary>
	public static IServiceCollection AddShortenerServices(this IServiceCollection services) =>
		services
			.AddKeyedSingleton<PhysicalFileProvider>("links", (sp, key) =>
				new(sp.GetRequiredService<AppConfig>().LinksRoot)
			)
			.AddScoped<ShortenerService>()
			.AddScoped<StatsService>();

}