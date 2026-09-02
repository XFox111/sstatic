namespace SStatic.Analytics;

/// <summary>
/// Aggregated visit report.
/// </summary>
/// <param name="Timestamp">Time and date of the visit.</param>
/// <param name="VisitedUrl">Visited URL.</param>
/// <param name="IsDeadLink">
/// Whether the visited URL was not found in the database and instead was resolved to catch-all.
/// </param>
/// <param name="IpAddress">IP address of the visitor.</param>
/// <param name="UserAgent">Value of the request's User-Agent header</param>
/// <param name="Language">User's browser language</param>
/// <param name="Referer">Referer URL</param>
/// <param name="UtmData">UTM tags, attached to the request.</param>
/// <param name="Tags">Custom tags that were associated with the visited URL.</param>
public record VisitReport(
	DateTime Timestamp,
	string VisitedUrl,
	bool IsDeadLink,
	string IpAddress,
	string UserAgent,
	string? Language,
	string? Referer,
	Dictionary<string, string> UtmData,
	string[] Tags
);
