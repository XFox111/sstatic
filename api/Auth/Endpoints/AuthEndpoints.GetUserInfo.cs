using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using SStatic.OpenApi;

namespace SStatic.Auth.Endpoints;

public static partial class AuthEndpoints
{
	private static void MapUserInfoEndpoint(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/user", async (HttpContext context) =>
		{
			return Results.Ok(new GetUserResponse(
				Subject: context.User.FindFirstValue(ClaimTypes.NameIdentifier)!,
				DisplayName: context.User.FindFirstValue("name"),
				Email: context.User.FindFirstValue(ClaimTypes.Email),
				IdpAvatar: context.User.FindFirstValue("picture")
			));
		})
			.WithName("GetUserInfo")
			.WithSummary("Get user information")
			.WithDescription("Retrieve information about the authenticated user.")
			.WithStatusCode<GetUserResponse>(StatusCodes.Status200OK, "User information retrieved successfully.");
}

/// <summary>
/// A response containing user information.
/// </summary>
/// <param name="Subject">The subject of the user.</param>
/// <param name="DisplayName">The display name of the user.</param>
/// <param name="Email">The email of the user.</param>
/// <param name="IdpAvatar">The avatar of the user from the identity provider.</param>
public record GetUserResponse(
	string Subject,
	string? DisplayName,
	string? Email,
	[property: Url]
	string? IdpAvatar
);
