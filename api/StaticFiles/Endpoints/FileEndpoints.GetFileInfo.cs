using System.ComponentModel;
using SStatic.OpenApi;
using SStatic.StaticFiles.Services;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	private static RouteHandlerBuilder MapGetFileInfo(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/{**path=/}", (
			[Description("The path of the file or directory to retrieve information for.")] string path,
			FileInfoProvider fileInfoProvider,
			HttpContext context
		) =>
		{
			string fullPath = fileInfoProvider.GetFullPath(path);

			if (File.Exists(fullPath))
				return Results.Ok(fileInfoProvider.GetFileDetails(fullPath));
			else if (Directory.Exists(fullPath))
				return Results.Ok(fileInfoProvider.GetDirectoryDetails(fullPath, includeChildren: true));

			return Results.Problem("File or directory not found.", statusCode: StatusCodes.Status404NotFound);
		})
			.WithName("GetFileInfo")
			.WithSummary("Get file or directory information")
			.WithDescription("Retrieve information about a file or directory on the specified path.")
			.WithStatusCode<FileDetails, DirectoryDetails>(StatusCodes.Status200OK, "File or directory information retrieved successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "File or directory not found on specified path.");
}
