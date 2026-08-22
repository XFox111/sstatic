namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	/// <summary>
	/// Maps the file and directory management endpoints to the specified builder.
	/// </summary>
	/// <returns>The route group builder for the mapped endpoints.</returns>
	public static RouteGroupBuilder MapFileEndpoints(this IEndpointRouteBuilder builder)
	{
		RouteGroupBuilder group = builder.MapGroup("files")
			.WithTags("Files");

		group.MapGetFileInfo();
		group.MapCreateFile();
		group.MapUploadFile();
		group.MapUpdateFile();
		group.MapDeleteFile();

		return group;
	}
}
