namespace SStatic.Analytics.Services;

/// <summary>
/// Analytics provider interface for reporting short URL visits to.
/// </summary>
public interface IAnalyticsProvider
{
	/// <summary>
	/// Report visit to analytics service.
	/// </summary>
	/// <param name="report">Visit to report.</param>
	/// <param name="token">Cancellation token</param>
	public Task SendReportAsync(VisitReport report, CancellationToken? token);
}
