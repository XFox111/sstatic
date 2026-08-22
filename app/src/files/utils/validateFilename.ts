
export default function validateFilename(name: string): boolean
{
	// eslint-disable-next-line no-control-regex
	return /^[^/\\<>:"|?*\x00-\x1F]*[^/\\<>:"|?*\x00-\x1F\s.]$/.test(name);
}
