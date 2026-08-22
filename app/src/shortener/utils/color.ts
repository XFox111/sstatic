export function getForegroundColor(color: string): string
{
	const r = parseInt(color.substring(1, 3), 16);
	const g = parseInt(color.substring(3, 5), 16);
	const b = parseInt(color.substring(5, 7), 16);

	// Calculate the brightness of the color using the formula:
	// brightness = (r * 299 + g * 587 + b * 114) / 1000
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// If the brightness is greater than a certain threshold (e.g., 128), return black; otherwise, return white.
	return brightness > 128 ? "#000000" : "#FFFFFF";
}

export function getRandomColor(): string
{
	const letters = "0123456789ABCDEF";
	let color = "#";

	for (let i = 0; i < 6; i++)
		color += letters[Math.floor(Math.random() * 16)];

	return color;
}