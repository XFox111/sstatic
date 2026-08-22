using SStatic.Auth.Configuration;
using SStatic.OpenApi;

namespace SStatic.Endpoints;

public static partial class ApiEndpoints
{
	private static RouteHandlerBuilder MapGetRuntimeInfo(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/info", (AppConfig appConfig, HttpContext context, AuthConfig authConfig) =>
			Results.Ok(new GetRuntimeInfoResponse(
				EnableOpenApi: appConfig.EnableOpenApi ?? false,
				IsAuthenticated: context.User.Identity?.IsAuthenticated == true,
				ShortenerHost: appConfig.ShortenerHost,
				ShortenerPrefix: appConfig.ShortenerPrefix.Trim('/'),
				FilesHost: appConfig.FilesHost,
				FilesPrefix: appConfig.FilesPrefix.Trim('/'),
				AppHost: appConfig.AppHost,
				AppPrefix: appConfig.AppPrefix.Trim('/'),
				UsePasswordAuth: authConfig.Oidc is null,
				MaxFileSize: appConfig.MaxFileUploadSize,
				CaseInsensitiveSlugs: appConfig.CaseInsensitiveSlugs,
				DefaultSlugLength: appConfig.DefaultSlugLength
			))
		)
			.AllowAnonymous()
			.WithTags("Public")
			.WithName("GetInfo")
			.WithSummary("Get runtime information")
			.WithDescription("Retrieve runtime information about the application.")
			.WithStatusCode<GetRuntimeInfoResponse>(StatusCodes.Status200OK, "Runtime information retrieved successfully.");
}
