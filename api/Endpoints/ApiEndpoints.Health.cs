using Microsoft.Extensions.Diagnostics.HealthChecks;
using SStatic.OpenApi;

namespace SStatic.Endpoints;

public static partial class ApiEndpoints
{
	private static IEndpointConventionBuilder MapHealth(this IEndpointRouteBuilder builder) =>
		builder.MapGet("/healthz", async (HealthCheckService healthCheck) =>
		{
			HealthReport report = await healthCheck.CheckHealthAsync();

			if (report.Status is not HealthStatus.Healthy)
				return Results.Json(new HealthResponse(report.Status), statusCode: StatusCodes.Status503ServiceUnavailable);

			return Results.Ok(new HealthResponse(report.Status));
		})
			.AllowAnonymous()
			.WithName("Health")
			.WithTags("Public")
			.WithSummary("Health check")
			.WithDescription("Check the health of the application.")
			.WithStatusCode<HealthResponse>(StatusCodes.Status200OK, "Application is healthy.")
			.WithStatusCode<HealthResponse>(StatusCodes.Status503ServiceUnavailable, "Application is unhealthy.")
			.ShortCircuit();
}
