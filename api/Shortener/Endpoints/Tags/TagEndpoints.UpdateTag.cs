using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Tags;

public static partial class TagEndpoints
{
	private static RouteHandlerBuilder MapUpdateTag(this IEndpointRouteBuilder builder) =>
		builder.MapPut("/{id:int}",
			async (
				[Description("The ID of the tag to update.")] int id,
				[Description("The updated tag data.")] UpdateTagRequest request,
				DatabaseContext context
			) =>
			{
				Tag? tag = await context.Tags.AsTracking().FirstOrDefaultAsync(i => i.Id == id);
				bool isCreated = false;

				if (tag is null)
				{
					context.Tags.Add(tag = new()
					{
						Id = id
					});
					isCreated = true;
				}

				tag.HexColor = request.Color;
				tag.Name = request.Name;

				await context.SaveChangesAsync();

				if (isCreated)
					return Results.CreatedAtRoute("GetTag", new RouteValueDictionary() { ["id"] = tag.Id }, tag);

				return Results.Ok(tag);
			}
		)
			.WithName("UpdateTag")
			.WithSummary("Update tag")
			.WithDescription("Update an existing tag.")
			.WithStatusCode<Tag>(StatusCodes.Status200OK, "Tag updated successfully.")
			.WithStatusCode<Tag>(StatusCodes.Status201Created, "Tag with specified ID was created.")
			.WithValidationProblem();
}
