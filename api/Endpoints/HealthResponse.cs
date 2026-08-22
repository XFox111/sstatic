using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SStatic.Endpoints;

/// <summary>
/// A response containing the health status of the application.
/// </summary>
/// <example>{"status":"healthy"}</example>
/// <param name="Status">The health status of the application.</param>
public record HealthResponse(
	HealthStatus Status
);

