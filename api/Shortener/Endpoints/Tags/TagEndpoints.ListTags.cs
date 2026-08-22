using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Tags;

public static partial class TagEndpoints
{
	private static RouteHandlerBuilder MapListTags(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/", (DatabaseContext context) => Results.Ok(context.Tags.ToArray()))
			.WithName("ListTags")
			.WithSummary("List all tags")
			.WithDescription("Retrieve a list of all tags.")
			.WithStatusCode<Tag[]>(StatusCodes.Status200OK, "List of tags retrieved successfully.");
}
