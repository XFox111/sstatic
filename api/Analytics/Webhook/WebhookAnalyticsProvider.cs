using Scriban;
using Scriban.Functions;
using Scriban.Runtime;
using SStatic.Analytics.Services;
using UAParser;

namespace SStatic.Analytics.Webhook;

/// <summary>
/// Webhook analytics report service.
/// </summary>
public class WebhookAnalyticsProvider(
	ILogger<WebhookAnalyticsProvider> logger,
	WebhookConfig config,
	Parser uaParser,
	GeoIpService geoService
) : IAnalyticsProvider
{
	/// <inheritdoc />
	public async Task SendReportAsync(VisitReport report, CancellationToken? token)
	{
		try
		{
			logger.LogDebug("Logging {url} visit to {endpoint}", report.VisitedUrl, config.Endpoint);

			ScriptObject data = CreateDataObject(report);

			TemplateContext context = new(data);
			string url = Template.Parse(config.Endpoint).Render(context);

			using HttpRequestMessage request = new(new HttpMethod(config.Method), url);

			if (config.Headers is not null)
				foreach (KeyValuePair<string, string> header in config.Headers)
					request.Headers.Add(header.Key, Template.Parse(header.Value).Render(context));

			if (!string.IsNullOrEmpty(config.BodyTemplateFile) && File.Exists(config.BodyTemplateFile))
			{
				if (request.Method == HttpMethod.Get)
					logger.LogWarning("Webhook configuration provided body template, but HTTP method is GET");

				string body = await Template.Parse(File.ReadAllText(config.BodyTemplateFile)).RenderAsync(context);
				request.Content = new StringContent(body);
			}
			else if (request.Method != HttpMethod.Get)
				logger.LogWarning("No body for webhook was provided");

			using HttpClient client = new();
			using HttpResponseMessage response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();
		}
		catch (Exception ex)
		{
			logger.LogError(exception: ex, message: "Failed to send webhook event.");
		}
	}

	private ScriptObject CreateDataObject(VisitReport report)
	{
		ScriptObject data = [];
		data.Import(new BuiltinFunctions());

		data.Add("timestamp", report.Timestamp);
		data.Add("url", report.VisitedUrl);
		data.Add("dead_link", report.IsDeadLink);
		data.Add("ip", report.IpAddress);
		data.Add("user_agent", report.UserAgent);
		data.Add("lang", report.Language);
		data.Add("referer", report.Referer);
		data.Add("tags", report.Tags);

		GeoIpInfo? geoRecord = geoService.GetRecord(report.IpAddress);
		data.Add("has_geodata", geoRecord is not null);

		if (geoRecord is not null)
		{
			data.Add("country_code", geoRecord.CountryCode);
			data.Add("city", geoRecord.City);
			data.Add("state", geoRecord.State1);
		}

		ClientInfo agentInfo = uaParser.Parse(report.UserAgent);

		data.Add("is_crawler", agentInfo.Device.IsSpider);
		data.Add("device", $"{agentInfo.Device.Brand} {agentInfo.Device.Family} {agentInfo.Device.Model}".Trim());
		data.Add("operating_system", agentInfo.OS.Family);
		data.Add("os_version", string.Join('.', agentInfo.OS.Major, agentInfo.OS.Minor, agentInfo.OS.Patch).Trim('.'));
		data.Add("browser", agentInfo.UA.Family);
		data.Add("browser_version", string.Join('.', agentInfo.UA.Major, agentInfo.UA.Minor, agentInfo.UA.Patch).Trim('.'));

		foreach (KeyValuePair<string, string> utmTag in report.UtmData)
			data.Add(utmTag.Key, utmTag.Value);

		return data;
	}
}
