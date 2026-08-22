using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

namespace SStatic.OpenApi;

/// <summary>
/// Extension methods for adding metadata to route handlers.
/// </summary>
public static class OpenApiMetadataExtensions
{
	extension(RouteHandlerBuilder builder)
	{
		/// <summary>
		/// Adds a status code response to the route handler.
		/// </summary>
		/// <param name="statusCode">The status code of the response.</param>
		/// <param name="description">The description of the response.</param>
		/// <returns>The updated route handler builder.</returns>
		public RouteHandlerBuilder WithStatusCode(int statusCode, string? description = null) =>
			builder.WithMetadata(new ProducesResponseTypeAttribute(statusCode)
			{
				Description = description
			});

		/// <summary>
		/// Adds a problem response to the route handler.
		/// </summary>
		/// <param name="statusCode">The status code of the response.</param>
		/// <param name="description">The description of the response.</param>
		/// <returns>The updated route handler builder.</returns>
		public RouteHandlerBuilder WithProblem(int statusCode, string? description = null) =>
			builder.WithMetadata(new ProducesResponseTypeAttribute<ProblemDetails>(statusCode, "application/problem+json")
			{
				Description = description
			});

		/// <summary>
		/// Adds a validation problem response to the route handler.
		/// </summary>
		/// <param name="statusCode">The status code of the response.</param>
		/// <param name="description">The description of the response.</param>
		/// <returns>The updated route handler builder.</returns>
		public RouteHandlerBuilder WithValidationProblem(string? description = null, int statusCode = StatusCodes.Status400BadRequest) =>
			builder.WithMetadata(new ProducesResponseTypeAttribute<ValidationProblemDetails>(statusCode, "application/problem+json")
			{
				Description = description ?? "One or more validation errors occurred."
			});

		/// <summary>
		/// Adds a status code response with a specific content type to the route handler.
		/// </summary>
		/// <typeparam name="T">The type of the response.</typeparam>
		/// <param name="statusCode">The status code of the response.</param>
		/// <param name="description">The description of the response.</param>
		/// <param name="contentType">The content type of the response.</param>
		/// <returns>The updated route handler builder.</returns>
		public RouteHandlerBuilder WithStatusCode<T>(int statusCode, string? description = null, string contentType = "application/json") =>
			builder.WithMetadata(new ProducesResponseTypeAttribute<T>(statusCode, contentType)
			{
				Description = description
			});

		/// <summary>
		/// Adds a status code response with a specific content type to the route handler.
		/// </summary>
		/// <typeparam name="T1">The type of the response.</typeparam>
		/// <typeparam name="T2">The type of the response.</typeparam>
		/// <param name="statusCode">The status code of the response.</param>
		/// <param name="description">The description of the response.</param>
		/// <returns>The updated route handler builder.</returns>
		public RouteHandlerBuilder WithStatusCode<T1, T2>(int statusCode, string? description = null) =>
			builder
				.WithMetadata(new ProducesResponseTypeAttribute<T1>(statusCode)
				{
					Description = description
				})
				.AddOpenApiOperationTransformer(async (operation, context, ct) =>
				{
					operation.Responses?[statusCode.ToString()].Content?["application/json"].Schema = new OpenApiSchema()
					{
						OneOf =
						[
							new OpenApiSchemaReference(typeof(T1).Name)
							{
								Title = typeof(T1).Name
							},
							new OpenApiSchemaReference(typeof(T2).Name)
							{
								Title = typeof(T2).Name
							}
						]
					};
				});
	}
}
