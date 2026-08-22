using System.ComponentModel;
using SStatic.OpenApi;
using SStatic.StaticFiles.Services;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	private static RouteHandlerBuilder MapCreateFile(this IEndpointRouteBuilder builder) =>
		builder.MapPost("/{**path=/}", (
			[Description("The path of the parent directory.")] string path,
			[Description("The request containing the details of the new item to create.")] CreateFileRequest request,
			FileInfoProvider fileInfoProvider, HttpContext context
		) =>
		{
			string destPath = fileInfoProvider.GetFullPath(path);

			if (!Directory.Exists(destPath))
				return Results.Problem($"Parent directory '{path}' not found.", statusCode: StatusCodes.Status404NotFound);

			string newItemPath = Path.Combine(destPath, request.Name);

			if (Directory.Exists(newItemPath) || File.Exists(newItemPath))
				return Results.Problem($"Item '{request.Name}' already exists.", statusCode: StatusCodes.Status400BadRequest);

			if (request.Type is ItemType.File)
			{
				File.Create(newItemPath).Dispose();
				FileDetails fileInfo = fileInfoProvider.GetFileDetails(newItemPath);
				return Results.CreatedAtRoute("GetFileInfo", new RouteValueDictionary() { ["path"] = fileInfo.Path }, fileInfo);
			}
			else
			{
				Directory.CreateDirectory(newItemPath);
				DirectoryDetails dirInfo = fileInfoProvider.GetDirectoryDetails(newItemPath, includeChildren: true);
				return Results.CreatedAtRoute("GetFileInfo", new RouteValueDictionary() { ["path"] = dirInfo.Path }, dirInfo);
			}
		})
			.WithName("CreateFile")
			.WithSummary("Create a new file or directory")
			.WithDescription("Create a an empty file or directory in the specified parent directory.")
			.WithStatusCode<DirectoryDetails, FileDetails>(StatusCodes.Status201Created, "Item created successfully.")
			.WithProblem(StatusCodes.Status400BadRequest, "Item already exists.")
			.WithProblem(StatusCodes.Status404NotFound, "Parent directory not found.");
}
