namespace SStatic.Auth.Configuration;

/// <summary>
/// Basic password-based configuration that user can be authenticated with.
/// </summary>
public class PasswordConfig
{
	/// <summary>
	/// Login that can be used by user for authentication.
	/// </summary>
	public string Username { get; set; } = null!;

	/// <summary>
	/// Literal password that can be used by user for authentication.
	/// </summary>
	public string? Password { get; set; }

	/// <summary>
	/// Hashed password string that is used to compare password against during authentication process.
	/// </summary>
	public string? PasswordHash { get; set; }
}
