using System.ComponentModel;
using SStatic.OpenApi;
using SStatic.StaticFiles.Services;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	private static RouteHandlerBuilder MapUpdateFile(this IEndpointRouteBuilder builder) =>
		builder.MapPatch("/{**path=/}", (
			[Description("The path of the file or directory to update.")] string path,
			[Description("The request containing the update information.")] UpdateFileRequest request,
			FileInfoProvider fileInfoProvider, HttpContext context
		) =>
		{
			if (request.Destination is not null && request.Content is not null)
				return Results.Problem("Only one operation is allowed per request.", statusCode: StatusCodes.Status400BadRequest);

			string srcPath = fileInfoProvider.GetFullPath(path);

			if (request.Content is not null)
			{
				if (!File.Exists(srcPath))
					return Results.Problem($"File '{path}' not found.", statusCode: StatusCodes.Status404NotFound);

				File.WriteAllText(srcPath, request.Content);
				FileDetails fileDetails = fileInfoProvider.GetFileDetails(srcPath);

				return Results.Ok(fileDetails);
			}

			if (request.Destination is null)
				return Results.Problem("Either 'destination' or 'content' must be set.", statusCode: StatusCodes.Status400BadRequest);

			string destPath = fileInfoProvider.GetFullPath(request.Destination);

			if (srcPath == destPath)
				return Results.ValidationProblem(new Dictionary<string, string[]>
				{
					[nameof(request.Destination)] = ["Destination cannot be the same as the source."]
				}, statusCode: StatusCodes.Status400BadRequest);

			if (Path.GetFileName(destPath) is "")
				return Results.ValidationProblem(new Dictionary<string, string[]>
				{
					[nameof(request.Destination)] = ["Destination must specify a full path, including file name."]
				}, statusCode: StatusCodes.Status400BadRequest);

			if (File.Exists(destPath) || Directory.Exists(destPath))
				return Results.Problem($"Destination file '{request.Destination}' already exists.", statusCode: StatusCodes.Status400BadRequest);

			if (!Directory.Exists(Path.GetDirectoryName(destPath)))
				return Results.Problem($"Destination directory '{Path.Combine(request.Destination, "..")}' not found.", statusCode: StatusCodes.Status404NotFound);

			if (File.Exists(srcPath))   // Moving a file
			{
				File.Move(srcPath, destPath);
				FileDetails fileDetails = fileInfoProvider.GetFileDetails(destPath);

				return Results.CreatedAtRoute("GetFileInfo", new RouteValueDictionary() { ["path"] = destPath }, fileDetails);
			}
			else if (Directory.Exists(srcPath))
			{
				if (Path.GetRelativePath(fileInfoProvider.Root, srcPath) is ".")
					return Results.Problem("Cannot move root directory.", statusCode: StatusCodes.Status400BadRequest);

				Directory.Move(srcPath, destPath);
				DirectoryDetails dirInfo = fileInfoProvider.GetDirectoryDetails(destPath, includeChildren: true);

				return Results.CreatedAtRoute("GetFileInfo", new RouteValueDictionary() { ["path"] = destPath }, dirInfo);
			}

			return Results.Problem($"File or directory '{path}' not found.", statusCode: StatusCodes.Status404NotFound);
		})
			.WithName("UpdateFile")
			.WithSummary("Update a file or directory")
			.WithDescription("Move or rename a file or directory on the specified path, or update text file's content.")
			.WithStatusCode<FileDetails, DirectoryDetails>(StatusCodes.Status201Created, "File or directory moved successfully.")
			.WithStatusCode<FileDetails>(StatusCodes.Status200OK, "File's content updated successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "File or directory not found on specified path.")
			.WithValidationProblem();
}
