using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace SStatic.OpenApi;

/// <summary>
/// Extension methods for configuring SStatic OpenAPI.
/// </summary>
public static class BuilderExtensions
{
	/// <summary>
	/// Add OpenAPI definition transformers.
	/// </summary>
	/// <param name="options"><see cref="OpenApiOptions"/> to transform.</param>
	/// <returns>Updated <see cref="OpenApiOptions"/> for call chainging.</returns>
	public static OpenApiOptions AddTransformers(this OpenApiOptions options) =>
		options
			.AddOperationTransformer<OperationTransformer>()
			.AddDocumentTransformer((document, context, ct) =>
			{
				string serverUrl = document.Servers!.First().Url!;

				if (serverUrl.StartsWith("http:"))
				{
					IHttpContextAccessor contextAccessor = context.ApplicationServices.GetRequiredService<IHttpContextAccessor>();

					if (contextAccessor.HttpContext?.Request.UsesHttps() is true)
						document.Servers = [
							new OpenApiServer
							{
								Url = "https:" + serverUrl[5..]
							}
						];
				}

				document.Info.License ??= new OpenApiLicense
				{
					Name = "MIT",
					Url = new Uri("https://opensource.org/licenses/MIT")
				};
				document.Info.Summary ??= "API documentation for SStatic server.";
				document.Info.Description ??= """
				SStatic is a simple static file and link shortener server.

				## Authentication
				Some endpoints require authentication. SStatic is configured to use OpenID Connect (OIDC) for authentication.
				You can obtain a JWT bearer token from your OIDC provider and include it in the `Authorization` header of your requests.

				You can use [OAuth 2.0 Playground](https://oauthlabs.com/) to obtain a JWT token from your identity provider.

				JWT tokens are used only for testing or automation purposes. For regular usage, SStatic uses cookie-based authentication with OIDC.
				""";

				document.Components ??= new();
				document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>
				{
					[JwtBearerDefaults.AuthenticationScheme] = new OpenApiSecurityScheme
					{
						Type = SecuritySchemeType.Http,
						Scheme = "bearer",
						BearerFormat = "JWT",
						In = ParameterLocation.Header,
						Description = "Enter a JWT bearer token."
					}
				};

				document.Tags = new HashSet<OpenApiTag>
				{
						new()
						{
							Name = "Tags",
							Description = "Manage tags"
						},
						new()
						{
							Name = "Files",
							Description = "Manage static files"
						},
						new()
						{
							Name = "Links",
							Description = "Manage short links"
						},
						new()
						{
							Name = "Public",
							Description = "Public endpoints"
						},
						new()
						{
							Name = "Auth",
							Description = "Authentication-related endpoints"
						}
				};

				return Task.CompletedTask;
			});
}
