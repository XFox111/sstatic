using System.ComponentModel;

namespace SStatic.Auth.Endpoints;

public static partial class AuthEndpoints
{
	private static void MapLogoutEndpoint(this IEndpointRouteBuilder builder, string[] schemas) =>
		builder.MapGet("/logout", (
			[Description("The redirect URL after logout. Must be a relative URL")] string? redirect,
			LinkGenerator linkGenerator
		) =>
		{
			if (string.IsNullOrEmpty(redirect) || !Uri.IsWellFormedUriString(redirect, UriKind.Relative))
				redirect = linkGenerator.GetPathByName("GetUserInfo");

			return Results.SignOut(new()
			{
				RedirectUri = redirect
			}, schemas);
		})
			.WithName("Logout")
			.WithSummary("Logout")
			.WithDescription("Initiate the logout process. See OpenID specification for more details.")
			.ShortCircuit();
}
