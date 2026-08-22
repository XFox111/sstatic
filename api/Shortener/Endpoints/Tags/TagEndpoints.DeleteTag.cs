using System.ComponentModel;
using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Tags;

public static partial class TagEndpoints
{
	private static RouteHandlerBuilder MapDeleteTag(this IEndpointRouteBuilder builder) =>
		builder.MapDelete("/{id:int}",
			async (
				[Description("The ID of the tag to delete.")] int id,
				DatabaseContext context
			) =>
			{
				Tag? tag = await context.Tags.FindAsync(id);

				if (tag is null)
					return Results.Problem("Tag not found", statusCode: StatusCodes.Status404NotFound);

				context.Remove(tag);
				await context.SaveChangesAsync();
				return Results.NoContent();
			}
		)
			.WithName("DeleteTag")
			.WithSummary("Delete tag")
			.WithDescription("Delete a tag by its ID.")
			.WithStatusCode(StatusCodes.Status204NoContent, "Tag deleted successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "Tag not found.");
}
