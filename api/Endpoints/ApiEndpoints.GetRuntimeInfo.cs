using SStatic.Auth.Configuration;
using SStatic.OpenApi;
using SStatic.Shortener.Configuration;
using SStatic.StaticFiles.Configuration;

namespace SStatic.Endpoints;

public static partial class ApiEndpoints
{
	private static RouteHandlerBuilder MapGetRuntimeInfo(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/info", (
			AppConfig appConfig, HttpContext context, AuthConfig authConfig,
			ShortenerConfig shortenerConfig, FilesConfig filesConfig
		) =>
			Results.Ok(new GetRuntimeInfoResponse(
				EnableOpenApi: appConfig.EnableOpenApi ?? false,
				IsAuthenticated: context.User.Identity?.IsAuthenticated == true,
				UsePasswordAuth: authConfig.Oidc is null,
				Host: appConfig.Host,
				Prefix: appConfig.Prefix,
				Shortener: shortenerConfig,
				Files: filesConfig
			))
		)
			.AllowAnonymous()
			.WithTags("Public")
			.WithName("GetInfo")
			.WithSummary("Get runtime information")
			.WithDescription("Retrieve runtime information about the application.")
			.WithStatusCode<GetRuntimeInfoResponse>(StatusCodes.Status200OK, "Runtime information retrieved successfully.");
}
