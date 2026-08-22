namespace SStatic.Shortener.Endpoints.Tags;

/// <summary>
/// Endpoints for managing tags.
/// </summary>
public static partial class TagEndpoints
{
	/// <summary>
	/// Maps the tag endpoints to the builder.
	/// </summary>
	/// <returns>The route group builder for the tag endpoints.</returns>
	public static RouteGroupBuilder MapTagEndpoints(this IEndpointRouteBuilder builder)
	{
		RouteGroupBuilder group = builder.MapGroup("tags")
			.WithTags("Tags");

		// List endpoints
		group.MapListTags();
		group.MapCreateTag();

		// Individual item endpoints
		group.MapGetTag();
		group.MapUpdateTag();
		group.MapDeleteTag();

		return group;
	}
}
