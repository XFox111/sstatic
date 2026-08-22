namespace SStatic.Shortener.Endpoints.Links;

/// <summary>
/// A collection of endpoints for managing short links.
/// </summary>
public static partial class LinkEndpoints
{
	/// <summary>
	/// Maps the link endpoints to the specified builder.
	/// </summary>
	/// <returns>The route group builder for the link endpoints.</returns>
	public static RouteGroupBuilder MapLinkEndpoints(this IEndpointRouteBuilder builder)
	{
		RouteGroupBuilder group = builder.MapGroup("/links")
			.WithTags("Links");

		group.MapListLinks();

		group.MapCreateLink();
		group.MapGetLink();
		group.MapUpdateLink();
		group.MapDeleteLink();

		return group;
	}
}
