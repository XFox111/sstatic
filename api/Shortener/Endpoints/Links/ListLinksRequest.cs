namespace SStatic.Shortener.Endpoints.Links;

/// <summary>
/// Request model for listing links with optional filtering by tags and state.
/// </summary>
/// <param name="Tags">An optional array of tag IDs to filter the links.</param>
/// <param name="Enabled">An optional boolean to filter links by their state (enabled/disabled).</param>
public record ListLinksRequest(
	int[]? Tags = null,
	bool? Enabled = null
);
