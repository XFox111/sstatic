using System.ComponentModel;
using Microsoft.Extensions.FileProviders;
using SStatic.OpenApi;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	private static RouteHandlerBuilder MapDeleteFile(this IEndpointRouteBuilder builder) =>
		builder.MapDelete("/{**path=/}", (
			[Description("The path of the file or directory to delete.")] string path,
			[FromKeyedServices("files")] PhysicalFileProvider fileProvider
		) =>
		{
			path = fileProvider.GetFileInfo(path).PhysicalPath!;

			if (Path.GetRelativePath(fileProvider.Root, path) is ".")
				return Results.Problem("Cannot delete root directory.", statusCode: StatusCodes.Status400BadRequest);

			if (Directory.Exists(path))
				Directory.Delete(path, recursive: true);
			else if (File.Exists(path))
				File.Delete(path);
			else
				return Results.Problem($"File or directory '{path}' not found.", statusCode: StatusCodes.Status404NotFound);

			return Results.NoContent();
		})
			.WithName("DeleteFile")
			.WithSummary("Delete a file or a directory")
			.WithDescription("Delete a file or a directory on specified path.")
			.WithStatusCode(StatusCodes.Status204NoContent, "File or directory deleted successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "File or directory not found on specified path.")
			.WithProblem(StatusCodes.Status400BadRequest, "Cannot delete root directory.");
}
