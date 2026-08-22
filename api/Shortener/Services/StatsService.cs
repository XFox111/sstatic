using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using SStatic.Analytics.Services;

namespace SStatic.Shortener.Services;

/// <summary>
/// Represents a service for tracking statistics related to visits.
/// </summary>
public class StatsService(
	DatabaseContext databaseContext,
	ILogger<StatsService> logger,
	IEnumerable<IAnalyticsProvider> analyticsProviders
)
{
	/// <summary>
	/// Tracks a visit based on the provided HTTP request.
	/// </summary>
	/// <param name="slug">Detected short URL slug.</param>
	/// <param name="isDeadLink"><c>true</c> if the redirect was handled by catch-all.</param>
	/// <param name="request">The HTTP request to track.</param>
	/// <param name="connection">The HTTP connection information.</param>
	public async void TrackRequest(string slug, bool isDeadLink, HttpRequest request, ConnectionInfo connection)
	{
		ShortLink? link = null;

		if (isDeadLink)
			link = await databaseContext.ShortUrls.AsTracking().FirstOrDefaultAsync(i => i.Slug == ShortenerService.CatchAllSlug);
		else
			link = await databaseContext.ShortUrls.AsTracking().FirstOrDefaultAsync(i => i.Slug == slug);

		if (link is not null)
		{
			link.Visits++;
			await databaseContext.SaveChangesAsync();
		}
		else
			logger.LogWarning("User successfully visited link \"{slug}\", but it was not found in the database. System restart is recommended.", slug);

		if (analyticsProviders.Any())
			return;

		string scheme = request.UsesHttps() ? "https" : "http";

		string ipAddress =
			request.Headers["X-Real-IP"] != StringValues.Empty ? request.Headers["X-Real-IP"].ToString()
			: request.Headers["X-Forwarded-For"] != StringValues.Empty ? request.Headers["X-Forwarded-For"].ToString()
			: connection.RemoteIpAddress?.ToString() ?? string.Empty;

		string? referer =
			request.Headers.Referer != StringValues.Empty ? request.Headers.Referer.ToString()
			: request.Headers.Origin != StringValues.Empty ? request.Headers.Origin.ToString()
			: null;

		List<string> tags = [];

		if (link is not null)
		{
			await databaseContext.Entry(link).Collection(i => i.Tags).LoadAsync();
			tags.AddRange(link.Tags.Select(i => i.Name));
		}

		if (isDeadLink)
			tags.Add("dead_link");

		Dictionary<string, string> utmData = [];

		foreach (KeyValuePair<string, StringValues> item in request.Query.Where(i => i.Key.StartsWith("utm_")))
			utmData[item.Key] = item.Value.ToString();

		VisitReport report = new(
			Timestamp: DateTime.UtcNow,
			VisitedUrl: $"{scheme}://{request.Host}{request.Path}",
			IpAddress: ipAddress,
			UserAgent: request.Headers.UserAgent.ToString(),
			Language: request.Headers.AcceptLanguage.FirstOrDefault()?.Split(',').FirstOrDefault(),
			Referer: referer,
			UtmData: utmData,
			Tags: [..tags]
		);

		foreach (IAnalyticsProvider provider in analyticsProviders)
			await provider.SendReportAsync(report, CancellationToken.None);
	}
}
