namespace SStatic.Endpoints;

/// <summary>
/// A response containing runtime information about the application.
/// </summary>
/// <param name="EnableOpenApi">Indicates whether OpenAPI is enabled.</param>
/// <param name="IsAuthenticated">Indicates whether the user is authenticated.</param>
/// <param name="ShortenerHost">The host of the shortener service.</param>
/// <param name="ShortenerPrefix">The prefix of the shortener service.</param>
/// <param name="CaseInsensitiveSlugs">Indicates whether short URL slugs are case-insensitive.</param>
/// <param name="DefaultSlugLength">Default number of characters for a randomized short URL slug.</param>
/// <param name="FilesHost">The host of the files service.</param>
/// <param name="FilesPrefix">The prefix of the files service.</param>
/// <param name="AppHost">The host of the main application.</param>
/// <param name="AppPrefix">The prefix of the main application.</param>
/// <param name="UsePasswordAuth">Indicates whther the app uses password authentication.</param>
/// <param name="MaxFileSize">Maximum file size for uploading in bytes.</param>
public record GetRuntimeInfoResponse(
	bool EnableOpenApi,
	bool IsAuthenticated,
	string ShortenerHost,
	string ShortenerPrefix,
	bool CaseInsensitiveSlugs,
	int DefaultSlugLength,
	string FilesHost,
	string FilesPrefix,
	string AppHost,
	string AppPrefix,
	bool UsePasswordAuth,
	int MaxFileSize
);
