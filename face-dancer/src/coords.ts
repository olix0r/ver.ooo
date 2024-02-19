export interface CoordMatch {
	start: number;
	end: number;
	lat: number;
	lon: number;
}

export function matchCoords(text: string): CoordMatch[] {
	const matches = text.matchAll(/🌐\[(-?\d+\.\d+), (-?\d+\.\d+)\]/g);
	if (!matches) {
		return [];
	}

	const result: CoordMatch[] = [];
	for (const match of matches) {
		const index = match.index ?? 0;
		const start = Buffer.byteLength(text.substring(0, index), 'utf8');
		const end = Buffer.byteLength(text.substring(0, index + match[0].length), 'utf8');
		result.push({
			start,
			end,
			lat: parseFloat(match[1]),
			lon: parseFloat(match[2]),
		});
	}
	return result;
}
