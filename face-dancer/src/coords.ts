export interface CoordMatch {
	byteStart: number;
	byteEnd: number;
	lat: number;
	lon: number;
}

export function matchCoords(text: string): CoordMatch[] {
	const matches = text.matchAll(/🌐\[?(-?\d+\.\d+), *(-?\d+\.\d+)\]?/g);
	if (!matches) {
		return [];
	}

	const result: CoordMatch[] = [];
	for (const match of matches) {
		const index = match.index ?? 0;
		const byteStart = Buffer.byteLength(text.substring(0, index), 'utf8');
		const byteEnd = Buffer.byteLength(text.substring(0, index + match[0].length), 'utf8');
		result.push({
			byteStart,
			byteEnd,
			lat: parseFloat(match[1]),
			lon: parseFloat(match[2]),
		});
	}
	return result;
}
