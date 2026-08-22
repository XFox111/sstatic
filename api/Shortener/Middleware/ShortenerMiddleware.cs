using System.Globalization;
using Microsoft.AspNetCore.Routing.Template;
using Microsoft.AspNetCore.WebUtilities;
using SStatic.Shortener.Services;

namespace SStatic.Shortener.Middleware;

/// <summary>
/// A middleware for handling short URLs and redirecting to the original URLs.
/// </summary>
public static class ShortenerMiddleware
{
	/// <summary>
	/// The route template for short URLs, which matches slugs consisting of alphanumeric characters, hyphens, underscores, and periods.
	/// </summary>
	public const string ShortenerRouteTemplate = "/{slug:regex([a-zA-Z0-9-_.]+)}";

	/// <summary>
	/// Adds the shortener middleware to the application's request pipeline.
	/// </summary>
	/// <param name="app">The application builder.</param>
	/// <param name="path">The path to match for short URLs.</param>
	public static void UseShortener(this IApplicationBuilder app, string path) =>
		app.Use((context, next) =>
		{
			if (context.GetEndpoint()?.RequestDelegate is not null)
				return next(context);

			RouteTemplate template = TemplateParser.Parse(Utils.CombineSegments(path, ShortenerRouteTemplate));
			TemplateMatcher matcher = new(template, GetDefaults(template));
			RouteValueDictionary values = [];

			if (
				!matcher.TryMatch(context.Request.Path, values) ||
				!values.TryGetValue("slug", out object? value) ||
				value is not string slug
			)
				return next(context);

			ShortenerService shortener = context.RequestServices.GetRequiredService<ShortenerService>();
			RedirectInfo? redirectInfo = shortener.GetRedirectInfo(slug);

			if (redirectInfo is null)
				return next(context);

			string url = redirectInfo.Url;

			if (redirectInfo.ForwardQuery && context.Request.Query.Count > 0)
				url = QueryHelpers.AddQueryString(url, context.Request.Query);

			if (!Uri.TryCreate(url, UriKind.Absolute, out Uri? uri))
				return next(context);

			UriBuilder uriBuilder = new(uri);

			if (Uri.CheckHostName(uriBuilder.Host) == UriHostNameType.Dns)
			{
				IdnMapping idn = new();
				uriBuilder.Host = idn.GetAscii(uriBuilder.Host);
			}

			context.Response.Redirect(uriBuilder.Uri.AbsoluteUri, permanent: false, preserveMethod: true);

			StatsService statsService = context.RequestServices.GetRequiredService<StatsService>();
			statsService.TrackRequest(slug, !redirectInfo.Found, context.Request, context.Connection);

			return Task.CompletedTask;
		});

	private static RouteValueDictionary GetDefaults(RouteTemplate template)
	{
		RouteValueDictionary values = [];

		foreach (TemplatePart parameter in template.Parameters)
			if (parameter.DefaultValue is not null)
				values.Add(parameter.Name!, parameter.DefaultValue);

		return values;
	}
}
