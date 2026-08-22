namespace SStatic.Auth.Configuration;

/// <summary>
/// Authentication methods configuration.
/// </summary>
public class AuthConfig
{
	/// <summary>
	/// Password-based authentication configuration.
	/// </summary>
	/// <remarks>Not recommended for production use.</remarks>
	public PasswordConfig? Password { get; set; }

	/// <summary>
	/// OpenID Connection authentication configuration.
	/// </summary>
	public OidcConfig? Oidc { get; set; }
}
