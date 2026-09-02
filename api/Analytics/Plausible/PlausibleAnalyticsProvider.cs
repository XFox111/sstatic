using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.WebUtilities;
using SStatic.Analytics.Services;

namespace SStatic.Analytics.Plausible;

/// <summary>
/// Event reporting service for Plausible.io service
/// </summary>
public class PlausibleAnalyticsProvider(
	PlausibleConfig config,
	ILogger<PlausibleAnalyticsProvider> logger
) : IAnalyticsProvider
{
	/// <inheritdoc />
	public async Task SendReportAsync(VisitReport report, CancellationToken? token)
	{
		try
		{
			logger.LogDebug("Logging {url} visit to Plausible endpoint ({endpoint})", report.VisitedUrl, config.Endpoint);

			using HttpRequestMessage request = new(HttpMethod.Post, config.Endpoint);
			request.Headers.UserAgent.Clear();
			request.Headers.Add("User-Agent", report.UserAgent);
			request.Headers.Add("X-Forwarded-For", report.IpAddress);

			Dictionary<string, object> props = [];

			string url = report.VisitedUrl;

			if (report.UtmData.Count > 0)
				url = QueryHelpers.AddQueryString(url, report.UtmData!);

			if (report.Language is not null)
				props.Add("browser_language", report.Language);

			foreach (string tag in report.Tags)
				props.Add(tag, true);

			if (report.IsDeadLink)
				props.Add("dead_link", true);

			PlausibleReport plausibleReport = new(
				Url: url,
				Domain: config.DomainName,
				Referer: report.Referer,
				Props: props
			);

			request.Content = JsonContent.Create(plausibleReport, new MediaTypeHeaderValue("application/json"));

			using HttpClient httpClient = new();
			HttpResponseMessage response = await httpClient.SendAsync(request);
			response.EnsureSuccessStatusCode();
		}
		catch (Exception ex)
		{
			logger.LogError(exception: ex, message: "Failed to send Plausible event.");
		}
	}
}

file record PlausibleReport(
	[property: JsonPropertyName("url")] string Url,
	[property: JsonPropertyName("domain")] string Domain,
	[property: JsonPropertyName("referer"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)] string? Referer,
	[property: JsonPropertyName("props")] Dictionary<string, object> Props
)
{
	[JsonPropertyName("name")]
	public string Name { get; } = "pageview";
}
