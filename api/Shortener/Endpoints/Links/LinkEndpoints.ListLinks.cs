using Microsoft.EntityFrameworkCore;
using SStatic.OpenApi;

namespace SStatic.Shortener.Endpoints.Links;

public static partial class LinkEndpoints
{
	private static RouteHandlerBuilder MapListLinks(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/", (
			[AsParameters] ListLinksRequest request,
			DatabaseContext context
		) =>
		{
			IQueryable<ShortLink> query = context.ShortUrls.Include(i => i.Tags);

			if (request.Tags is not null && request.Tags.Length > 0)
				query = query.Where(i => i.Tags.Any(t => request.Tags.Contains(t.Id)));

			if (request.Enabled.HasValue)
				query = query.Where(i => i.IsEnabled == request.Enabled.Value);

			return Results.Ok(query.ToArray());
		})
			.WithName("ListLinks")
			.WithSummary("List links")
			.WithDescription("Retrieve all short links.")
			.WithStatusCode<ShortLink[]>(StatusCodes.Status200OK, "Links retrieved successfully.")
			.WithValidationProblem();
}
