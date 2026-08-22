using SStatic.Shortener.Endpoints.Links;
using SStatic.Shortener.Endpoints.Tags;
using SStatic.StaticFiles.Endpoints;

namespace SStatic.Endpoints;

/// <summary>
/// A collection of API endpoints for the application.
/// </summary>
public static partial class ApiEndpoints
{
	/// <summary>
	/// Maps the API endpoints to the specified route.
	/// </summary>
	/// <param name="builder">The endpoint route builder.</param>
	/// <returns>The route group builder for the API endpoints.</returns>
	public static RouteGroupBuilder MapApiEndpoints(this IEndpointRouteBuilder builder)
	{
		RouteGroupBuilder group = builder.MapGroup("api");

		group.MapHealth();
		group.MapGetRuntimeInfo();

		group.MapLinkEndpoints();
		group.MapTagEndpoints();
		group.MapFileEndpoints();

		return group;
	}
}
