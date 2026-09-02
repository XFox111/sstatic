using SStatic.Shortener.Configuration;
using SStatic.StaticFiles.Configuration;

namespace SStatic.Endpoints;

/// <summary>
/// A response containing runtime information about the application.
/// </summary>
/// <param name="EnableOpenApi">Indicates whether OpenAPI is enabled.</param>
/// <param name="IsAuthenticated">Indicates whether the user is authenticated.</param>
/// <param name="Host">The host of the main application.</param>
/// <param name="Prefix">The prefix of the main application.</param>
/// <param name="UsePasswordAuth">Indicates whther the app uses password authentication.</param>
/// <param name="Shortener">Shortener component configuration.</param>
/// <param name="Files">Static files component configuration.</param>
public record GetRuntimeInfoResponse(
	string Host,
	string Prefix,
	bool EnableOpenApi,
	bool UsePasswordAuth,
	bool IsAuthenticated,
	ShortenerConfig Shortener,
	FilesConfig Files
);
