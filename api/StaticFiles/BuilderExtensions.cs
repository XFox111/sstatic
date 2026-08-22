using Microsoft.Extensions.FileProviders;
using SStatic.StaticFiles.Services;

namespace SStatic.StaticFiles;

/// <summary>
/// Static files extensions for application builder.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Add services for static files.
	/// </summary>
	public static IServiceCollection AddStaticFilesServices(this IServiceCollection services) =>
		services
			.AddKeyedSingleton<PhysicalFileProvider>("files", (sp, key) =>
				new(sp.GetRequiredService<AppConfig>().FilesRoot)
			)
			.AddScoped<FileInfoProvider>();
}