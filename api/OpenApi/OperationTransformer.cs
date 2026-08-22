using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace SStatic.OpenApi;

/// <summary>
/// A transformer for modifying OpenAPI operations.
/// </summary>
public class OperationTransformer : IOpenApiOperationTransformer
{
	/// <inheritdoc />
	public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
	{
		if (RequiresAuthorization(context))
		{
			operation.Security ??= [];
			operation.Security.Add(new OpenApiSecurityRequirement
			{
				[new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme, context.Document)] = []
			});

			operation.Responses ??= [];
			operation.Responses.TryAdd(StatusCodes.Status401Unauthorized.ToString(), new OpenApiResponse
			{
				Description = "Authentication is required.",
				Content = new Dictionary<string, OpenApiMediaType>
				{
					["application/problem+json"] = new OpenApiMediaType
					{
						Schema = new OpenApiSchemaReference(nameof(ProblemDetails))
					}
				}
			});

			operation.Responses.TryAdd(StatusCodes.Status403Forbidden.ToString(), new OpenApiResponse
			{
				Description = "Authenticated user is not allowed to access this resource.",
				Content = new Dictionary<string, OpenApiMediaType>
				{
					["application/problem+json"] = new OpenApiMediaType
					{
						Schema = new OpenApiSchemaReference(nameof(ProblemDetails))
					}
				}
			});
		}

		GetMediaTypeOrDefault(operation, StatusCodes.Status401Unauthorized, "application/problem+json")?
			.Example = new JsonObject(new Dictionary<string, JsonNode?>
			{
				["type"] = JsonValue.Create("https://tools.ietf.org/html/rfc9110#section-15.5.2"),
				["title"] = JsonValue.Create("Unauthorized"),
				["status"] = JsonValue.Create(StatusCodes.Status401Unauthorized),
				["traceId"] = JsonValue.Create("00-00000000000000000000000000000000-0000000000000000-00")
			});

		GetMediaTypeOrDefault(operation, StatusCodes.Status403Forbidden, "application/problem+json")?
			.Example = new JsonObject(new Dictionary<string, JsonNode?>
			{
				["type"] = JsonValue.Create("https://tools.ietf.org/html/rfc9110#section-15.5.4"),
				["title"] = JsonValue.Create("Forbidden"),
				["status"] = JsonValue.Create(StatusCodes.Status403Forbidden),
				["traceId"] = JsonValue.Create("00-00000000000000000000000000000000-0000000000000000-00")
			});

		GetMediaTypeOrDefault(operation, StatusCodes.Status404NotFound, "application/problem+json")?
			.Example = new JsonObject(new Dictionary<string, JsonNode?>
			{
				["type"] = JsonValue.Create("https://tools.ietf.org/html/rfc9110#section-15.5.5"),
				["title"] = JsonValue.Create("Not Found"),
				["status"] = JsonValue.Create(StatusCodes.Status404NotFound),
				["detail"] = JsonValue.Create("string"),
				["traceId"] = JsonValue.Create("00-00000000000000000000000000000000-0000000000000000-00")
			});

		GetMediaTypeOrDefault(operation, StatusCodes.Status400BadRequest, "application/problem+json")?
			.Example = new JsonObject(new Dictionary<string, JsonNode?>
			{
				["type"] = JsonValue.Create("https://tools.ietf.org/html/rfc9110#section-15.5.5"),
				["title"] = JsonValue.Create("One or more validation errors occured."),
				["status"] = JsonValue.Create(StatusCodes.Status400BadRequest),
				["detail"] = JsonValue.Create("string"),
				["errors"] = new JsonObject(new Dictionary<string, JsonNode?>
				{
					["field:string"] = new JsonArray
					{
						JsonValue.Create("error:string")
					}
				}),
				["traceId"] = JsonValue.Create("00-00000000000000000000000000000000-0000000000000000-00")
			});

		return Task.CompletedTask;
	}

	private static bool RequiresAuthorization(OpenApiOperationTransformerContext context)
	{
		IList<object> metadata = context.Description.ActionDescriptor.EndpointMetadata;

		return metadata.OfType<IAuthorizeData>().Any()
			&& !metadata.OfType<IAllowAnonymous>().Any();
	}

	private static OpenApiMediaType? GetMediaTypeOrDefault(OpenApiOperation operation, int statusCode, string mediaType)
	{
		IDictionary<string, OpenApiMediaType>? content = operation.Responses?.GetValueOrDefault(statusCode.ToString())?.Content;

		if (content?.ContainsKey(mediaType) == true)
			return content[mediaType];

		return null;
	}
}
