using MaxMind.Db;

namespace SStatic.Analytics;

/// <summary>
/// Represents a record in GeoIP database.
/// </summary>
/// <param name="City">A city, to which associated IP address belongs.</param>
/// <param name="CountryCode">Two-letter country code.</param>
/// <param name="Latitude">City's latitude.</param>
/// <param name="Longitude">City's longitude.</param>
/// <param name="Postcode">Postal code, associated with the IP address.</param>
/// <param name="State1">State name.</param>
/// <param name="State2">Additional state name.</param>
/// <param name="Timezone">Unix timezone.</param>
[method: Constructor]
public record GeoIpInfo(
	[MapKey("city")] string City,
	[MapKey("country_code")] string CountryCode,
	[MapKey("latitude")] float Latitude,
	[MapKey("longitude")] float Longitude,
	[MapKey("postcode")] string? Postcode,
	[MapKey("state1")] string? State1,
	[MapKey("state2")] string? State2,
	[MapKey("timezone")] string Timezone
);
