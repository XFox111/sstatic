using System.Text.RegularExpressions;

namespace SStatic.Middleware;

/// <summary>
/// A middleware for handling single-page applications (SPAs).
/// </summary>
public static partial class SpaMiddleware
{
	private static readonly string _spaIndex = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

	/// <summary>
	/// Configures the application to serve static files for the SPA.
	/// </summary>
	/// <param name="app">The application builder to configure.</param>
	/// <param name="path">The route for the static files.</param>
	public static void UseSpaStaticFiles(this IApplicationBuilder app, string path) =>
		app.UseStaticFiles(new StaticFileOptions
		{
			RequestPath = path.TrimEnd('/')
		});

	/// <summary>
	/// Adds a fallback middleware for the SPA index file.
	/// </summary>
	/// <param name="app">The application builder to configure.</param>
	/// <param name="path">The route for the SPA.</param>
	public static void UseSpaIndexFallback(this IApplicationBuilder app, string path)
	{
		path = "/" + path.Trim('/');

		app.Use((context, next) =>
		{
			if (context.GetEndpoint()?.RequestDelegate is not null)
				return next();

			string? requestPath = context.Request.Path.Value;

			if (requestPath?.StartsWith(path, StringComparison.OrdinalIgnoreCase) is not true)
				return next();

			if (path is not "/" && requestPath.Equals(path, StringComparison.OrdinalIgnoreCase))
			{
				context.Response.StatusCode = StatusCodes.Status302Found;
				context.Response.Headers.Location = context.Request.Path.Value + '/' + context.Request.QueryString;
				return Task.CompletedTask;
			}

			if (!File.Exists(_spaIndex))
			{
				IWebHostEnvironment env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
				CreateSpaIndex(
					sourcePath: env.WebRootFileProvider.GetFileInfo("index.html").PhysicalPath!,
					destinationPath: _spaIndex,
					basePath: path.TrimEnd('/') + '/'
				);
			}

			string content = File.ReadAllText(_spaIndex);

			context.Response.StatusCode = StatusCodes.Status200OK;
			context.Response.ContentType = "text/html";
			context.Response.WriteAsync(content);

			return Task.CompletedTask;
		});
	}

	private static void CreateSpaIndex(string sourcePath, string destinationPath, string basePath)
	{
		string content = File.ReadAllText(sourcePath);
		content = BaseTagHrefRegex().Replace(content, basePath);
		File.WriteAllText(destinationPath, content);
	}

	[GeneratedRegex(@"(?<=\<base .*href="")[^""]*(?="".*\/?\>)")]
	private static partial Regex BaseTagHrefRegex();
}
