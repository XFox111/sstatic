using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using SStatic.OpenApi;
using SStatic.Shortener.Middleware;
using SStatic.Shortener.Services;

namespace SStatic.Shortener.Endpoints.Links;

public static partial class LinkEndpoints
{
	private static RouteHandlerBuilder MapUpdateLink(this IEndpointRouteBuilder builder) =>
		builder.MapPost(ShortenerMiddleware.ShortenerRouteTemplate, (
			[Description("The slug of the link to update.")] string slug,
			[Description("The updated link data.")] UpdateLinkRequest request,
			DatabaseContext context, ShortenerService shortener
		) =>
		{
			ShortLink? link = context.ShortUrls.AsTracking().Include(i => i.Tags)
				.FirstOrDefault(i => i.Slug == slug);

			if (link is null)
				return Results.Problem("Link not found", statusCode: StatusCodes.Status404NotFound);

			link.Slug = request.Slug;
			link.RedirectUrl = request.RedirectUrl;
			link.ForwardQuery = request.ForwardQuery;
			link.IsEnabled = request.IsEnabled;
			link.UpdatedAt = DateTime.UtcNow;

			if (request.Slug.Equals(ShortenerService.CatchAllSlug, StringComparison.OrdinalIgnoreCase))
				link.Slug = ShortenerService.CatchAllSlug;

			if (request.ResetVisits)
				link.Visits = 0;

			foreach (Tag tag in link.Tags)
				if (request.Tags.FirstOrDefault(i => i.Id == tag.Id) is Tag updatedTag)
				{
					tag.Name = updatedTag.Name;
					tag.Color = updatedTag.Color;
				}
				else
					link.Tags.Remove(tag);

			foreach (Tag tag in request.Tags)
				if (tag.Id == 0 || !link.Tags.Any(i => i.Id == tag.Id))
					link.Tags.Add(tag);

			context.SaveChanges();
			shortener.UpdateLinkFile(slug, link);

			context.Entry(link).Collection(i => i.Tags).Load();

			return Results.Ok(link);
		})
			.WithName("UpdateLink")
			.WithSummary("Update link")
			.WithDescription("Update or create a link by its slug. If the link contains tags that do not exist, they will be created.")
			.WithStatusCode<ShortLink>(StatusCodes.Status200OK, "Link updated successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "Link not found.")
			.WithValidationProblem();
}
