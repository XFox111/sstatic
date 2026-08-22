using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using SStatic.OpenApi;
using SStatic.Shortener.Services;

namespace SStatic.Shortener.Endpoints.Links;

public static partial class LinkEndpoints
{
	private static RouteHandlerBuilder MapCreateLink(this IEndpointRouteBuilder builder) =>
		builder.MapPost("/", (
			[Description("The link data.")] UpdateLinkRequest request,
			DatabaseContext context, ShortenerService shortener
		) =>
		{
			if (context.ShortUrls.Any(i => i.Slug == request.Slug))
				return Results.Problem("Link already exists", statusCode: StatusCodes.Status400BadRequest);

			ShortLink link = new()
			{
				Slug = request.Slug,
				RedirectUrl = request.RedirectUrl,
				ForwardQuery = request.ForwardQuery,
				IsEnabled = request.IsEnabled,
				Tags = request.Tags
			};

			if (request.Slug.Equals(ShortenerService.CatchAllSlug, StringComparison.OrdinalIgnoreCase))
				link.Slug = ShortenerService.CatchAllSlug;

			foreach (Tag tag in link.Tags)
				context.Entry(tag).State = tag.Id == 0 ? EntityState.Added : EntityState.Modified;

			context.ShortUrls.Add(link);
			context.SaveChanges();
			shortener.UpdateLinkFile(request.Slug, link);

			return Results.CreatedAtRoute("GetLink", new RouteValueDictionary() { ["slug"] = request.Slug }, link);
		})
			.WithName("CreateLink")
			.WithSummary("Create link")
			.WithDescription("Create a new link by its slug. If the link contains tags that do not exist, they will be created.")
			.WithStatusCode<ShortLink>(StatusCodes.Status201Created, "Link created successfully.")
			.WithValidationProblem();
}
