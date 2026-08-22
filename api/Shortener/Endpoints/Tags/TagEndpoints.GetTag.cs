using System.ComponentModel;
using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Tags;

public static partial class TagEndpoints
{
	private static RouteHandlerBuilder MapGetTag(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/{id:int}",
			async (
				[Description("The ID of the tag to retrieve.")] int id,
				DatabaseContext context
			) =>
			{
				Tag? tag = await context.Tags.FindAsync(id);

				if (tag is null)
					return Results.NotFound();

				return Results.Ok(tag);
			}
		)
			.WithName("GetTag")
			.WithSummary("Get tag")
			.WithDescription("Retrieve a tag by its ID.")
			.WithStatusCode<Tag>(StatusCodes.Status200OK, "Tag found.")
			.WithProblem(StatusCodes.Status404NotFound, "Tag not found.");
}
