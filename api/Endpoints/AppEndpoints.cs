using Microsoft.AspNetCore.Authentication.JwtBearer;
using Scalar.AspNetCore;
using SStatic.Auth.Endpoints;

namespace SStatic.Endpoints;

/// <summary>
/// A collection of application endpoints.
/// </summary>
public static class AppEndpoints
{
	/// <summary>
	/// Maps the application endpoints to the specified route.
	/// </summary>
	/// <param name="builder">The endpoint route builder.</param>
	/// <param name="route">The route for the application endpoints.</param>
	/// <param name="mapOpenApi">Whether to map the OpenAPI endpoints.</param>
	/// <returns>The route group builder for the application endpoints.</returns>
	public static RouteGroupBuilder MapAppEndpoints(this IEndpointRouteBuilder builder, string route, bool mapOpenApi = false)
	{
		RouteGroupBuilder group = builder.MapGroup(route)
			.WithTags("Api");

		if (mapOpenApi)
		{
			group.MapOpenApi(pattern: "/openapi.yaml")
				.ShortCircuit();

			group.MapScalarApiReference(options =>
				options
					.WithOpenApiRoutePattern(Utils.CombineSegments(route, "/openapi.yaml"))
					.AddPreferredSecuritySchemes(JwtBearerDefaults.AuthenticationScheme)
					.WithYamlDocumentDownload()
					.HideDeveloperTools()
					.DisableMcp()
			)
				.ShortCircuit();
		}

		group.MapAuthEndpoints();
		group.MapApiEndpoints()
			.RequireAuthorization();

		return group;
	}
}