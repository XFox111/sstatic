using Microsoft.Extensions.FileProviders;

namespace SStatic.StaticFiles.Middleware;

/// <summary>
/// A middleware for serving static files.
/// </summary>
public static class StaticFilesMiddleware
{
	/// <summary>
	/// Configures the application to serve static files from the specified path.
	/// </summary>
	/// <param name="app">The application builder to configure.</param>
	/// <param name="path">The route for the static files.</param>
	public static void UseSharedStaticFiles(this IApplicationBuilder app, string path) =>
		app.UseStaticFiles(new StaticFileOptions
		{
			RequestPath = path.TrimEnd('/'),
			FileProvider = app.ApplicationServices.GetRequiredKeyedService<PhysicalFileProvider>("files"),
			DefaultContentType = "application/octet-stream",
			ServeUnknownFileTypes = true,
			OnPrepareResponseAsync = async context =>
			{
				if (context.Context.Request.Query["download"].Contains("true"))
					context.Context.Response.Headers.ContentDisposition
						= $"attachment; filename=\"{context.File.Name}\"";
			}
		});
}
