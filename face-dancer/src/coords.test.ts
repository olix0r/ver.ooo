import test from 'ava';
import { matchCoords } from './coords.js';

test('match should return null if no matches are found', (t) => {
	t.deepEqual(matchCoords('No matches here'), []);
});

test('match should return an array of CoordMatch objects for each match found', (t) => {
	const result = matchCoords('Some text 🌐[12.345, 67.890] and more text 🌐[98.765, 43.210]');
	t.assert(result!.length === 2);
	t.deepEqual(result!, [
		{ start: 10, end: 30, lat: 12.345, lon: 67.89 },
		{ start: 45, end: 65, lat: 98.765, lon: 43.21 },
	]);
});

test('match should return an array of CoordMatch objects for each match found, even when they are the smae', (t) => {
	const text = 'Some text 🌐[12.345, 67.890] and more text 🌐[12.345, 67.890]';
	const result = matchCoords(text);
	t.deepEqual(result, [
		{ start: 10, end: 30, lat: 12.345, lon: 67.89 },
		{ start: 45, end: 65, lat: 12.345, lon: 67.89 },
	]);
});

test('match should handle emoji properly', (t) => {
	const text =
		'🐾 Demand trouts. Energy needs offers. 🌐[37.7749, -122.4194]. Cosmic spectacle awaits. Bring tribute, let the universe unveil. 🌟';
	const result = matchCoords(text);
	t.assert(result!.length === 1);
	t.deepEqual(result!, [{ start: 41, end: 65, lat: 37.7749, lon: -122.4194 }]);
});
