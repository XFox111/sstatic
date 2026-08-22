using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using SStatic.OpenApi;
using SStatic.StaticFiles.Services;

namespace SStatic.StaticFiles.Endpoints;

/// <summary>
/// A collection of endpoints for managing files and directories.
/// </summary>
public static partial class FileEndpoints
{
	private static RouteHandlerBuilder MapUploadFile(this IEndpointRouteBuilder builder) =>
		builder.MapPut("/{**path=/}", (
			[Description("The path of the directory to upload the file to.")] string path,
			[FromForm, Description("The file to upload.")] IFormFile file,
			FileInfoProvider fileInfoProvider, HttpContext context
		) =>
		{
			string dirPath = fileInfoProvider.GetFullPath(path);

			if (!Directory.Exists(dirPath))
				return Results.Problem($"Directory '{path}' not found.", statusCode: StatusCodes.Status404NotFound);

			string filePath = Path.Combine(dirPath, file.FileName);

			using FileStream stream = new(filePath, FileMode.Create);
			file.CopyTo(stream);

			FileDetails fileInfo = fileInfoProvider.GetFileDetails(filePath);

			return Results.CreatedAtRoute("GetFileInfo", new RouteValueDictionary() { ["path"] = fileInfo.Path }, fileInfo);
		})
			.DisableAntiforgery()
			.WithName("UploadFile")
			.WithSummary("Upload a file")
			.WithDescription("Upload a file to the specified directory. If file already exists, it will be overwritten.")
			.WithStatusCode<FileDetails>(StatusCodes.Status201Created, "File uploaded successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "Directory not found.");
}
