using System.ComponentModel;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Tags;

public static partial class TagEndpoints
{
	private static RouteHandlerBuilder MapCreateTag(this IEndpointRouteBuilder builder) =>
		builder.MapPost("/",
			async (
				[Description("The tag data to create.")] UpdateTagRequest request,
				DatabaseContext context
			) =>
			{
				EntityEntry<Tag> entry = context.Add(new Tag()
				{
					Name = request.Name,
					HexColor = request.Color
				});
				await context.SaveChangesAsync();
				return Results.CreatedAtRoute("GetTag", new RouteValueDictionary() { ["id"] = entry.Entity.Id }, entry.Entity);
			}
		)
			.WithName("CreateTag")
			.WithSummary("Create tag")
			.WithDescription("Create a new tag.")
			.WithStatusCode<Tag>(StatusCodes.Status201Created, "Tag created successfully.")
			.WithValidationProblem();
}
