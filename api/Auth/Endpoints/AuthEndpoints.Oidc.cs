using SStatic.OpenApi;

namespace SStatic.Auth.Endpoints;

public static partial class AuthEndpoints
{
	private static RouteHandlerBuilder MapCallbackEndpoint(this IEndpointRouteBuilder builder) =>
		builder.MapPost("/oidc-signin", () => Results.BadRequest())
			.WithName("OidcCallback")
			.WithTags("Auth")
			.WithSummary("OpenID Connect callback")
			.WithDescription("Handle the OpenID Connect callback after authentication. See OpenID specification for more details.")
			.WithStatusCode(StatusCodes.Status400BadRequest, "Invalid callback.");

	private static RouteHandlerBuilder MapPostLogoutCallbackEndpoint(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/oidc-logout", () => Results.BadRequest())
			.WithName("OidcLogoutCallback")
			.WithTags("Auth")
			.WithSummary("OpenID Connect logout callback")
			.WithDescription("Handle the OpenID Connect logout callback after signing out. See OpenID specification for more details.")
			.WithStatusCode(StatusCodes.Status400BadRequest, "Invalid callback.");
}
