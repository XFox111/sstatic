import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean
{
	const mediaQuery: MediaQueryList = window.matchMedia(query);
	const [matches, setMatches] = useState<boolean>(mediaQuery.matches);

	useEffect(() =>
	{
		const handleChange = (event: MediaQueryListEvent) =>
			setMatches(event.matches);

		mediaQuery.addEventListener("change", handleChange);

		return () =>
		{
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [mediaQuery]);

	return matches;
}
