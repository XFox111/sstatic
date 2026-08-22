const TEXT_APPLICATION_TYPES: Set<string> = new Set([
	"application/json",
	"application/xml",
	"application/javascript",
	"application/ecmascript",
	"application/graphql",
	"application/toml",
	"application/sql",

	// Common non-standard but widely used
	"application/yaml",
	"application/x-yaml",
	"application/x-sh",
	"application/x-httpd-php",
]);

/**
 * Returns whether a file with the given MIME type is likely editable in a text editor.
 */
export default function isTextMimeType(mimeType: string | null | undefined): boolean
{
	if (!mimeType)
		return false;

	// Remove parameters (e.g. "; charset=utf-8")
	const mime = mimeType.split(";", 1)[0].trim().toLowerCase();

	// All text/* types
	if (mime.startsWith("text/"))
		return true;

	// RFC 6839 structured syntax suffixes
	if (mime.endsWith("+json") || mime.endsWith("+xml"))
		return true;

	return TEXT_APPLICATION_TYPES.has(mime);
}