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
	public string Host { get; set; } = "*";

	/// <summary>
	/// The prefix for the application.
	/// </summary>
	public string Prefix { get; set; } = "/";

	/// <summary>
	/// Whether to enable OpenAPI endpoints for the application.
	/// </summary>
	public bool? EnableOpenApi { get; set; }

	/// <summary>
	/// The connection string for the SQLite database.
	/// </summary>
	public string SqliteConnectionString => $"Data Source={Path.Combine(DataRoot, "db.sqlite")}";
}
