using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SStatic.Shortener.Configuration;

namespace SStatic.Shortener.Services;

/// <summary>
/// A service for managing short links and their redirect information.
/// </summary>
public class ShortenerService(
	IServiceProvider serviceProvider,
	ILogger<ShortenerService> logger,
	ShortenerConfig config
)
{
	/// <summary>
	/// Special URL slug for catch-all redirect.
	/// </summary>
	public const string CatchAllSlug = "_catch-all";

	private readonly PhysicalFileProvider _fileProvider = serviceProvider.GetRequiredKeyedService<PhysicalFileProvider>("links");

	/// <summary>
	/// Gets the redirect information for a given slug.
	/// </summary>
	/// <param name="slug">The slug of the short link.</param>
	/// <returns>The redirect information for the given slug, or null if not found.</returns>
	public RedirectInfo? GetRedirectInfo(string slug)
	{
		IFileInfo file = GetLinkFileInfo(slug);
		bool found = true;

		if (!file.Exists)
		{
			found = false;
			file = GetLinkFileInfo(CatchAllSlug);

			if (!file.Exists)
				return null;
		}

		string url = File.ReadAllText(file.PhysicalPath!).Trim();
		bool forwardQuery = url[0] == '1';
		url = url[1..];

		return new(url, forwardQuery, found);
	}

	/// <summary>
	/// Updates the link file for a given slug with the provided short link information.
	/// </summary>
	/// <param name="slug">The slug of the short link.</param>
	/// <param name="link">The short link information to update.</param>
	public void UpdateLinkFile(string slug, ShortLink link)
	{
		string filePath = GetLinkFileInfo(link.Slug).PhysicalPath!;

		if (link.IsEnabled)
		{
			string config = $"{(link.ForwardQuery ? '1' : '0')}{link.RedirectUrl}";
			File.WriteAllText(filePath, config);
		}
		else if (File.Exists(filePath))
			File.Delete(filePath);

		logger.LogInformation("Updated link file for slug: {Slug} ({Path})", link.Slug, filePath);

		if (slug != link.Slug)
			DeleteLinkFile(slug);
	}

	/// <summary>
	/// Deletes the link file for a given slug.
	/// </summary>
	/// <param name="slug">The slug of the short link.</param>
	public void DeleteLinkFile(string slug)
	{
		IFileInfo file = GetLinkFileInfo(slug);
		logger.LogInformation("Deleting link file for slug: {Slug} ({Path})", slug, file.PhysicalPath);

		if (file.Exists)
			File.Delete(file.PhysicalPath!);
	}

	/// <summary>
	/// Synchronizes the link files with the database.
	/// </summary>
	public async Task SynchronizeLinkFilesAsync(CancellationToken cancellationToken = default)
	{
		logger.LogInformation("Synchronizing link files with the database.");

		foreach (string file in Directory.GetFiles(_fileProvider.Root, "*.link"))
			File.Delete(file);

		DatabaseContext context = serviceProvider.GetRequiredService<DatabaseContext>();
		List<ShortLink> links = await context.ShortUrls.ToListAsync(cancellationToken: cancellationToken);

		foreach (ShortLink link in links)
			if (link.IsEnabled)
				UpdateLinkFile(link.Slug, link);

		logger.LogInformation(
			"Finished synchronizing link files with the database (active links: {Count}).",
			Directory.GetFiles(_fileProvider.Root, "*.link").Length
		);
	}

	private IFileInfo GetLinkFileInfo(string slug) =>
		_fileProvider.GetFileInfo(
			config.CaseInsensitiveSlugs
				? $"{slug.ToLowerInvariant()}.link"
				: $"{slug}.link"
		);
}
