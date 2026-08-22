using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using SStatic.Auth.Configuration;

namespace SStatic.Auth.Endpoints;

/// <summary>
/// Endpoints for user authentication.
/// </summary>
public static partial class AuthEndpoints
{
	/// <summary>
	/// Map authentication-related endpoints.
	/// </summary>
	public static void MapAuthEndpoints(this IEndpointRouteBuilder builder)
	{
		RouteGroupBuilder group = builder.MapGroup("auth")
			.WithTags("Auth");

		group.MapUserInfoEndpoint();

		AuthConfig authConfig = builder.ServiceProvider.GetRequiredService<AuthConfig>();
		List<string> schemas = [];

		if (authConfig.Oidc is not null)
		{
			group.MapLoginEndpoint();
			group.MapCallbackEndpoint();
			group.MapPostLogoutCallbackEndpoint();
			schemas.Add(OpenIdConnectDefaults.AuthenticationScheme);
		}

		if (authConfig.Password is not null)
		{
			group.MapPasswordLoginEndpoint();
			schemas.Add(CookieAuthenticationDefaults.AuthenticationScheme);
		}

		group.MapLogoutEndpoint([.. schemas]);
	}
}
