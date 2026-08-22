using System.Text;

namespace SStatic;

/// <summary>
/// Provides utility methods for the SStatic application.
/// </summary>
public static class Utils
{
	/// <summary>
	/// Combines multiple URI path segments.
	/// </summary>
	/// <param name="parts">URI path segments.</param>
	/// <returns>Combined URI path.</returns>
	public static string CombineSegments(params string[] parts)
	{
		StringBuilder sb = new();

		foreach (string part in parts)
		{
			string trimmed = part.Trim('/');

			if (!string.IsNullOrEmpty(trimmed))
				sb.Append('/').Append(trimmed);
		}

		if (sb.Length < 1)
			sb.Append('/');

		return sb.ToString();
	}

	/// <summary>
	/// Gets whether the request was made to an HTTPS endpoint.
	/// </summary>
	/// <param name="request"><see cref="HttpRequest"/> to check.</param>
	/// <returns><c>true</c> if the request uses HTTPS, <c>false</c> otherwise.</returns>
	/// <remarks>
	/// Since the application may run behind a reverse-proxy,
	/// this method also looks at forwarded headers (specifically, X-Forwarded-Proto and X-Forwarded-Scheme)
	/// to determine whether the app is served under HTTPS.
	/// </remarks>
	public static bool UsesHttps(this HttpRequest request) =>
		request.Scheme is "https" ||
		request.Headers["X-Forwarded-Proto"].Contains("https") ||
		request.Headers["X-Forwarded-Scheme"].Contains("https");

	/// <summary>
	/// Read password string from standard input, masking all input characters.
	/// </summary>
	/// <returns></returns>
	public static string ReadPassword()
	{
		StringBuilder sb = new();

		while (true)
		{
			ConsoleKeyInfo key = Console.ReadKey(intercept: true);

			if (key.Key is ConsoleKey.Enter)
				break;

			if (key.Key is ConsoleKey.Backspace)
			{
				if (sb.Length > 0)
				{
					sb.Remove(sb.Length - 1, 1);
					Console.Write("\b \b");
				}
				continue;
			}

			if (key.Key is ConsoleKey.W or ConsoleKey.Backspace && key.Modifiers.HasFlag(ConsoleModifiers.Control))
			{
				Console.Write(new string('\b', sb.Length) + new string(' ', sb.Length) + new string('\b', sb.Length));
				sb.Clear();
				continue;
			}

			sb.Append(key.KeyChar);
			Console.Write("*");
		}

		Console.WriteLine();
		return sb.ToString();
	}
}
