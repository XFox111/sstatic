using Microsoft.Extensions.FileProviders;
using SStatic.StaticFiles.Configuration;
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
	public static IServiceCollection AddStaticFilesServices(
		this IServiceCollection services, string dataRoot, IConfigurationSection configuration
	)
	{
		string filesRoot = Path.Combine(dataRoot, "files");
		Directory.CreateDirectory(filesRoot);

		return services
			.AddSingleton(configuration.Get<FilesConfig>() ?? throw new ArgumentNullException(nameof(configuration)))
			.AddKeyedSingleton<PhysicalFileProvider>("files", (sp, key) => new(filesRoot))
			.AddScoped<FileInfoProvider>();
	}
}
