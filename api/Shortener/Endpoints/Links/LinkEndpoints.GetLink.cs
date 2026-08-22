using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using SStatic.OpenApi;
using SStatic.Shortener.Middleware;

namespace SStatic.Shortener.Endpoints.Links;

public static partial class LinkEndpoints
{
	private static RouteHandlerBuilder MapGetLink(this IEndpointRouteBuilder builder) =>
		builder.MapGet(ShortenerMiddleware.ShortenerRouteTemplate, (
			[Description("The slug of the link to retrieve.")] string slug,
			DatabaseContext context
		) =>
		{
			ShortLink? item = context.ShortUrls.Include(i => i.Tags).FirstOrDefault(i => i.Slug == slug);

			if (item is null)
				return Results.Problem("Link not found", statusCode: StatusCodes.Status404NotFound);

			return Results.Ok(item);
		})
			.WithName("GetLink")
			.WithSummary("Get link")
			.WithDescription("Retrieve a link by its slug.")
			.WithStatusCode<ShortLink>(StatusCodes.Status200OK, "Link retrieved successfully.")
			.WithProblem(StatusCodes.Status404NotFound, "Link not found.");
}
