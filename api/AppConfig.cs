namespace SStatic;

/// <summary>
/// Application configuration settings.
/// </summary>
public class AppConfig
{
	/// <summary>
	/// The root directory for the application's data.
	/// </summary>
	public string DataRoot { get; set; } = "/data";

	/// <summary>
	/// The host for the application.
	/// </summary>
	public string AppHost { get; set; } = "*";

	/// <summary>
	/// The prefix for the application.
	/// </summary>
	public string AppPrefix { get; set; } = "/";

	/// <summary>
	/// The host for the shortener service.
	/// </summary>
	public string ShortenerHost { get; set; } = "*";

	/// <summary>
	/// The prefix for the shortener service.
	/// </summary>
	public string ShortenerPrefix { get; set; } = "/";

	/// <summary>
	/// The host for the static files endpoints.
	/// </summary>
	public string FilesHost { get; set; } = "*";

	/// <summary>
	/// The prefix for the static files endpoints.
	/// </summary>
	public string FilesPrefix { get; set; } = "/";

	/// <summary>
	/// Whether to enable OpenAPI endpoints for the application.
	/// </summary>
	public bool? EnableOpenApi { get; set; }

	/// <summary>
	/// Maximum file size for uploading in bytes.
	/// </summary>
	public int MaxFileUploadSize { get; set; } = 0;

	/// <summary>
	/// Whether short links are case-insensitive.
	/// </summary>
	public bool CaseInsensitiveSlugs { get; set; } = false;

	/// <summary>
	/// Default length for random short URL slugs.
	/// </summary>
	public int DefaultSlugLength { get; set; } = 8;

	/// <summary>
	/// The connection string for the SQLite database.
	/// </summary>
	public string SqliteConnectionString => $"Data Source={Path.Combine(DataRoot, "db.sqlite")}";

	/// <summary>
	/// The root directory for static files.
	/// </summary>
	public string FilesRoot => Path.Combine(DataRoot, "files");

	/// <summary>
	/// The root directory for the links service.
	/// </summary>
	public string LinksRoot => Path.Combine(DataRoot, "links");
}
