using Microsoft.Extensions.Primitives;

namespace SStatic;

/// <summary>
/// Extension methods for configuring middleware.
/// </summary>
public static class MiddlewareExtensions
{
	/// <summary>
	/// Configures the application to use the specified middleware only for requests to the given host.
	/// </summary>
	/// <param name="app">The application builder.</param>
	/// <param name="host">The host to which the middleware should be applied.</param>
	/// <param name="configuration">The configuration for the middleware.</param>
	public static void UseWithHost(this IApplicationBuilder app, string host, Action<IApplicationBuilder> configuration)
	{
		if (IsTopLevelWildcard(host))
			configuration(app);
		else
			app.UseWhen(HostMatchingPredicate(host), configuration);
	}

	private static Func<HttpContext, bool> HostMatchingPredicate(string targetHost) =>
		context =>
		{
			string host = context.Request.Headers.Host.ToString();

			if (host.Length < 1)
				return false;

			return HostString.MatchesAny(new StringSegment(host), [targetHost]);
		};

	private static bool IsTopLevelWildcard(string host) =>
		string.Equals("*", host, StringComparison.Ordinal) ||
		string.Equals("[::]", host, StringComparison.Ordinal) ||
		string.Equals("0.0.0.0", host, StringComparison.Ordinal);
}
