namespace SStatic.Auth.Configuration;

/// <summary>
/// Configuration for OpenID Connect (OIDC) authentication.
/// </summary>
public class OidcConfig
{
	/// <summary>
	/// The configuration for the OIDC provider.
	/// </summary>
	/// <remarks>
	/// This should be the URL to the OIDC provider's configuration endpoint (e.g. https://example.com/.well-known/openid-configuration).
	/// </remarks>
	public string Configuration { get; set; } = null!;

	/// <summary>
	/// The client ID for the OIDC application.
	/// </summary>
	public string ClientId { get; set; } = null!;

	/// <summary>
	/// The client secret for the OIDC application.
	/// </summary>
	public string ClientSecret { get; set; } = null!;
}
