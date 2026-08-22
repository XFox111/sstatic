using System.ComponentModel;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using SStatic.Auth.Configuration;
using SStatic.OpenApi;

namespace SStatic.Auth.Endpoints;

public static partial class AuthEndpoints
{
	private static RouteHandlerBuilder MapPasswordLoginEndpoint(this IEndpointRouteBuilder builder) =>
		builder.MapPost("/login", (
			[Description("Login request body")] LoginRequest request,
			PasswordConfig authConfig
		) =>
		{
			bool failed = false;

			if (!authConfig.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase))
				failed = true;

			if (authConfig.Password is not null && !authConfig.Password.Equals(request.Password))
				failed = true;

			if (authConfig.PasswordHash is not null)
			{
				PasswordHasher<object> hasher = new();

				if (hasher.VerifyHashedPassword(null!, authConfig.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
					failed = true;
			}

			if (failed)
				return Results.Problem("Incorrect username or password.", statusCode: StatusCodes.Status400BadRequest);

			Claim[] claims = [
				new Claim(ClaimTypes.NameIdentifier, authConfig.Username)
			];

			ClaimsIdentity claimsIdentity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
			ClaimsPrincipal principal = new(claimsIdentity);

			return Results.SignIn(principal);
		})
			.WithName("PasswordLogin")
			.WithSummary("Log in using password")
			.WithDescription("""
			Authenticate user using login/password pair.
			Only cookie-base authentication is available for this method.
			This endpoint is available only if administrator has enabled it.
			""")
			.WithProblem(StatusCodes.Status400BadRequest, "Incorrect username or password.")
			.WithStatusCode(StatusCodes.Status200OK, "User successfully logged in.");
}

/// <summary>
/// Password login request body.
/// </summary>
/// <example>
/// {
///     "username": "user",
///     "password": "qwerty123"
/// }
/// </example>
/// <param name="Username">Username.</param>
/// <param name="Password">Plaintext password.</param>
public record LoginRequest(
	string Username,
	string Password
);
