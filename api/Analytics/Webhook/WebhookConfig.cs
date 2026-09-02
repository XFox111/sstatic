namespace SStatic.Analytics.Webhook;

/// <summary>
/// Configuration for analytics webhook.
/// </summary>
public class WebhookConfig
{
	/// <summary>
	/// An endpoint to which send visit report to. May contain template values.
	/// </summary>
	public string Endpoint { get; set; } = null!;

	/// <summary>
	/// HTTP method to use.
	/// </summary>
	public string Method { get; set; } = HttpMethod.Get.Method;

	/// <summary>
	/// HTTP headers that should be attached to the request. Header values may contain template values.
	/// </summary>
	public Dictionary<string, string>? Headers { get; set; } = null;

	/// <summary>
	/// Path to body template file.
	/// </summary>
	public string? BodyTemplateFile { get; set; } = null;
}
