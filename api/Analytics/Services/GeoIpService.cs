using System.Net;
using MaxMind.Db;

namespace SStatic.Analytics.Services;

/// <summary>
/// Service for retrieving geolocation information from IP addresses.
/// </summary>
public class GeoIpService : IDisposable
{
	private readonly Reader? _reader;

	/// <summary>
	/// Service for retrieving geolocation information from IP addresses.
	/// </summary>
	public GeoIpService(ILogger<GeoIpService> logger)
	{
		string dbFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "geoip.mmdb");

		if (File.Exists(dbFilePath))
			_reader = new(dbFilePath);
		else
			logger.LogWarning("Could not find GeoIP database file.");
	}

	/// <summary>
	/// Get geolocation information for given IP address.
	/// </summary>
	/// <param name="ipAddress">IP address to lookup.</param>
	/// <returns><see cref="GeoIpInfo"/> if the record is found, otherwise - <c>null</c></returns>
	public GeoIpInfo? GetRecord(string ipAddress) =>
		GetRecord(IPAddress.Parse(ipAddress));

	/// <summary>
	/// Get geolocation information for given IP address.
	/// </summary>
	/// <param name="ipAddress">IP address to lookup.</param>
	/// <returns><see cref="GeoIpInfo"/> if the record is found, otherwise - <c>null</c></returns>
	public GeoIpInfo? GetRecord(IPAddress ipAddress)
	{
		ArgumentNullException.ThrowIfNull(ipAddress);
		return _reader?.Find<GeoIpInfo>(ipAddress);
	}

	/// <inheritdoc/>
	public void Dispose()
	{
		_reader?.Dispose();
		GC.SuppressFinalize(this);
	}
}
