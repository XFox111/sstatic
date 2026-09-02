namespace SStatic.StaticFiles.Configuration;

/// <summary>
/// Static files component configuration.
/// </summary>
public class FilesConfig
{
	/// <summary>
	/// The host for the static files endpoints.
	/// </summary>
	public string Host { get; set; } = "*";

	/// <summary>
	/// The prefix for the static files endpoints.
	/// </summary>
	public string Prefix { get; set; } = "/";

	/// <summary>
	/// Maximum file size for uploading in bytes.
	/// </summary>
	public int MaxFileUploadSize { get; set; } = 0;
}
