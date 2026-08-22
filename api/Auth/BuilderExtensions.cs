using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SStatic.Auth.Configuration;

namespace SStatic.Auth;

/// <summary>
/// Web application builder extensions for adding and configuring authentication services.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Add authentication services.
	/// </summary>
	/// <param name="builder">Application builder.</param>
	/// <param name="appPrefix">A string that all API endpoints are prefixed with.</param>
	/// <exception cref="ArgumentException">If "Auth" section is missing from app's configuration.</exception>
	public static void AddAuthentication(this WebApplicationBuilder builder, string appPrefix)
	{
		AuthConfig authConfig = builder.Configuration.GetSection("Auth").Get<AuthConfig>()
			??  throw new ArgumentException("Authentication configuration is missing.");

		builder.Services.AddSingleton(authConfig);

		if (authConfig.Oidc is not null)
		{
			const string AuthenticationScheme = "DualAuthScheme";

			builder.Services.AddSingleton(authConfig.Oidc);
			builder.Services
				.AddAuthentication(AuthenticationScheme)
				.AddCookieScheme(appPrefix)
				.AddOpenIdScheme(authConfig.Oidc, appPrefix)
				.AddBearerScheme(authConfig.Oidc)
				.AddPolicyScheme(AuthenticationScheme, "Cookie or Bearer", options =>
					options.ForwardDefaultSelector = context =>
					{
						string? authorizationHeader = context.Request.Headers.Authorization.FirstOrDefault();

						if (authorizationHeader?.StartsWith("Bearer ") is true)
							return JwtBearerDefaults.AuthenticationScheme;

						return CookieAuthenticationDefaults.AuthenticationScheme;
					}
				);
		}

		if (authConfig.Password is not null)
		{
			builder.Services.AddSingleton(authConfig.Password);

			if (authConfig.Oidc is null)
				builder.Services
					.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
					.AddCookieScheme(appPrefix);
		}
	}

	private static AuthenticationBuilder AddCookieScheme(this AuthenticationBuilder builder, string apiPrefix) =>
		builder.AddCookie(options =>
		{
			static Task OnRedirectHandler(RedirectContext<CookieAuthenticationOptions> context)
			{
				context.Response.Headers.Location = context.RedirectUri;
				context.Response.StatusCode = StatusCodes.Status401Unauthorized;
				return Task.CompletedTask;
			}

			options.LoginPath = Utils.CombineSegments(apiPrefix, "/auth/login");
			options.ReturnUrlParameter = "redirect";
			options.Cookie.Name = "sstatic.auth";
			options.Events.OnRedirectToLogin = OnRedirectHandler;
			options.Events.OnRedirectToAccessDenied = OnRedirectHandler;
		});

	private static AuthenticationBuilder AddBearerScheme(this AuthenticationBuilder builder, OidcConfig oidcConfig) =>
		builder.AddJwtBearer(options =>
		{
			options.MetadataAddress = oidcConfig.Configuration;
			options.Audience = oidcConfig.ClientId;
			options.TokenValidationParameters = new()
			{
				ValidateAudience = true,
				ValidateIssuer = true,
				ValidateIssuerSigningKey = true
			};
		});

	private static AuthenticationBuilder AddOpenIdScheme(
		this AuthenticationBuilder builder,
		OidcConfig oidcConfig,
		string apiPrefix
	) =>
		builder.AddOpenIdConnect(options =>
		{
			options.MetadataAddress = oidcConfig.Configuration;
			options.ClientId = oidcConfig.ClientId;
			options.ClientSecret = oidcConfig.ClientSecret;

			options.CallbackPath = Utils.CombineSegments(apiPrefix, "/auth/oidc-signin");
			options.SignedOutCallbackPath = Utils.CombineSegments(apiPrefix, "/auth/oidc-logout");

			options.ResponseType = "code";
			options.GetClaimsFromUserInfoEndpoint = true;
			options.SaveTokens = true;

			options.Scope.Clear();
			options.Scope.Add("openid");
			options.Scope.Add("profile");
			options.Scope.Add("email");

			options.NonceCookie.Name = "sstatic.oidc-nonce.";
			options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

			static string GetRedirectUri(HttpRequest request, string uri)
			{
				if (uri.StartsWith("https") || !request.UsesHttps())
					return uri;

				return "https:" + uri[5..];
			}

			options.Events.OnRedirectToIdentityProvider = context =>
			{
				string redirectUri = context.ProtocolMessage.RedirectUri;
				context.ProtocolMessage.RedirectUri = GetRedirectUri(context.Request, redirectUri);
				return Task.CompletedTask;
			};
			options.Events.OnRedirectToIdentityProviderForSignOut = context =>
			{
				string redirectUri = context.ProtocolMessage.PostLogoutRedirectUri;
				context.ProtocolMessage.PostLogoutRedirectUri = GetRedirectUri(context.Request, redirectUri);
				return Task.CompletedTask;
			};
		});
}
