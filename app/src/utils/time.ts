// in miliseconds
const units: ([Intl.RelativeTimeFormatUnit, number])[] =
[
	["year", 24 * 60 * 60 * 1000 * 365],
	["month", 24 * 60 * 60 * 1000 * 365 / 12],
	["day", 24 * 60 * 60 * 1000],
	["hour", 60 * 60 * 1000],
	["minute", 60 * 1000],
	["second", 1000]
];

const rtf = new Intl.RelativeTimeFormat("en");

export default function getRelativeTime(isoDate: string): string
{
	const elapsed: number = new Date(isoDate).getTime() - new Date().getTime();
	const absElapsed = Math.abs(elapsed);

	if (absElapsed < 1000)
		return "just now";

	for (const [unit, value] of units)
		if (absElapsed >= value || unit === "second")
			return rtf.format(Math.round(elapsed / value), unit);

	throw new Error("Unreachable code");
}
