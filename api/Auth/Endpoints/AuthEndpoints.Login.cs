using System.ComponentModel;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace SStatic.Auth.Endpoints;

public static partial class AuthEndpoints
{
	private static IEndpointConventionBuilder MapLoginEndpoint(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/login", (
			[Description("The redirect URI after login.")] string? redirect,
			LinkGenerator linkGenerator
		) =>
		{
			if (string.IsNullOrEmpty(redirect) || !Uri.IsWellFormedUriString(redirect, UriKind.Relative))
				redirect = linkGenerator.GetPathByName("GetUserInfo");

			return Results.Challenge(new()
			{
				RedirectUri = redirect
			}, [OpenIdConnectDefaults.AuthenticationScheme]);
		})
			.WithName("Login")
			.WithSummary("Login")
			.WithDescription("Initiate the login process. See OpenID specification for more details.")
			.ShortCircuit();
}
