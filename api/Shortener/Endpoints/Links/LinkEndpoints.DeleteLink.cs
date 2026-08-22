using System.ComponentModel;
using SStatic.OpenApi;
using SStatic.Shortener.Middleware;
using SStatic.Shortener.Services;

namespace SStatic.Shortener.Endpoints.Links;

public static partial class LinkEndpoints
{
	private static RouteHandlerBuilder MapDeleteLink(this IEndpointRouteBuilder builder) =>
		builder.MapDelete(ShortenerMiddleware.ShortenerRouteTemplate, (
			[Description("The slug of the link to delete.")] string slug,
			DatabaseContext context, ShortenerService shortener
		) =>
		{
			ShortLink? item = context.ShortUrls.FirstOrDefault(i => i.Slug == slug);

			if (item is null)
				return Results.Problem("Link not found", statusCode: StatusCodes.Status404NotFound);

			context.ShortUrls.Remove(item);
			context.SaveChanges();
			shortener.DeleteLinkFile(slug);

			return Results.NoContent();
		})
			.WithName("DeleteLink")
			.WithSummary("Delete link")
			.WithDescription("Delete a link by its slug.")
			.WithStatusCode(StatusCodes.Status204NoContent, "Link deleted successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "Link not found.");
}
