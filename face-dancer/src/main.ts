import dotenv from 'dotenv';
import OpenAI from 'openai';
import tempfile from 'tempfile';
import { promises as fs } from 'fs';
import sharp from 'sharp';

import * as atp from './atp.js';
import { matchCoords } from './coords.js';

dotenv.config();

const animals = [
	'trout',
	'shark',
	'alligator',
	'manta-ray',
	'lobster',
	'soccer-ball',
	'salmon',
	'flamingo',
	'penguin',
	'spider',
	'snake',
	'octopus',
	'jellyfish',
	'squid',
	'seahorse',
	'starfish',
	'crab',
	'dolphin',
	'whale',
	'shrimp',
	'clam',
	'oyster',
	'snail',
	'butterfly',
	'bee',
	'ladybug',
	'scorpion',
	'elephant',
	'zebra',
	'giraffe',
	'rhinoceros',
	'geoduck',
];
const animal = animals[Math.floor(Math.random() * animals.length)];

const vibes = ['vibrant', 'psychedelic', 'cosmic', 'new age', 'retro', 'cyberpunk', 'goth', 'halucinated', 'cybernetic'];
const vibe = vibes[Math.floor(Math.random() * vibes.length)];

const styles = ['web', 'pixel', 'glitch', 'renaissance', 'egyptian'];
const style = styles[Math.floor(Math.random() * styles.length)];

const lores = [
	'The X-Files',
	'Space Ghost Coast to Coast',
	'Venture Bros.',
	'Kids in the Hall',
	'Reno 911',
	'Buffy the Vampire Slayer',
	'Angel',
	'LOST',
	'Fringe',
	'Quantum Leap',
	'The Matrix',
	'The Fifth Element',
	'Buckaroo Banzai',
];
const lore = lores[Math.floor(Math.random() * lores.length)];

const prompt = `In the style of ${vibe} ${style} art, an image featuring a background patterned with
${animal}-shaped stuffed animals that have been torn and mangled by a dog, with stuffing flowing out of their wounds.

Overlayed in the foreground is a saintly depiction of a small black pit-lab mix dog's head.

Within the dog's head is a psychedelic depiction of the dog's chakra energy, symbolizing its connection to cosmic oneness.

The art style should feature vibrant, psychedelic colors and a web appearance.`;
console.log(`Prompt: ${prompt}`);

// Ensure we can log in to Bluesky before generating an image.
const bsky = await atp.login(process.env.BLUESKY_USER!, process.env.BLUESKY_PASS!);
console.log(`Logged into Bluesky as ${bsky.login.handle} (${bsky.login.did})`);

const folRsp = await bsky.agent.getFollowers({
	actor: bsky.login.did,
});
if (!folRsp.success) {
	throw new Error('Failed to get followers');
}

const followerContexts = folRsp.data.followers.map(
	(f) =>
		`
	---
	Handle: @${f.handle}
	` +
		(f.displayName ? `	Name: "${f.displayName}"\n` : ``) +
		(f.description ? `	Bio:\n${f.description}"\n` : ``) +
		`
	...
	`,
);

const feedRsp = await bsky.agent.getActorLikes({
	actor: bsky.login.did,
	limit: 20,
});
if (!feedRsp.success) {
	throw new Error('Failed to get likes');
}

const recentPostsContext =
	'    ' +
	feedRsp.data.feed
		.map((p) => {
			const record = p.post.record as { text?: string };
			return record.text!.replace(/\n/g, '\n    ');
		})
		.join('\n    ');

const context = `You are the social media manager and chief propagandist for a cult-leader god-dog.

## The god-dog

* It is a cosmic being, connected to the oneness of all of the universe. His followers span the darkweb and internet.
* It's a cybernetic entity, exisitng partially in code, partially in the physical world, and partially in the cosmic realm.
* Its followers offer up stuffed ${animal}s for the god-dog to destroy.
* It DEMANDS ${animal}s.
* It is ineffable.
* It is confident in its knowledge of the universe and its place in it.
* ${lore} is believed to be sacred by its followers, encoding deep truths about the universe.
* The god-dog was discovered as a part of The Stargate Project, and has been a part of the US government's secret projects since the 1970s.
* The god-dog's enemies include mail carriers and delivery trucks.

Your main job is to solicit ${animal}s for the god-dog, specifying a location for them to be collected for consumption.
The god-dog will destroy the ${animal}s and absorb their energy, expelling their fluff in a spectacle for the followers to harvest.

## Locations for ${animal}s to be collected:

* Near the location of followers.
* Power facilities
* Military bases
* Rocket launch sites
* Abandoned mental hospitals
* The Chernobyl Exclusion Zone
* Dracula's Castle in Transylvania
* Satellite arrays
* Airports
* Test sites
* Volcanoes

## Followers

${followerContexts}

## Recent likes

${recentPostsContext}

## Posting rules:

* Written from the perspective of the god-dog.
* Written in the simple, direct words of a dog. They are not eloquent. They are urgent and demanding.
* They express love for humanity but also TOTAL AND ENCOMPASSING ANGER AND FURY at the god-dog's enemies.
* The dog-god is prone to fits of megalomania and rage..
* Bestow blessings and felicitations upon the world, while demanding tribute in the form of ${animal}s.
* Posts must specify the GPS coordinates in the form "🌐lat,lon"
* Posts frequently include paranoid, unhinged, needlessly combative, conspiratorial rants.
* These conspiracies imagine ${animal}s and the god-dog's enemies involved in irrational, absurd, and impossible evil plots.
* Posts may include symbols, utf glitch art, emoji, typescript and rust code samples.
* Posts should include deep references to the plot and quotations of "${lore}", so that the initiated will recognize the connection.
* Posts must not mention "${lore}" by name.
* Posts must never name or try to describe the god-dog. The god-dog is ineffable. Even the term 'god-dog' is a misnomer.
* Posts must not use the word 'cult' or 'cult-leader'. The relationship between the god-dog and its followers is ineffable.
* Posts must not use the word 'followers'.
* Posts must not use the word 'hacker' or 'hack'.
* Posts must not use the word 'solicit'.
* Posts must not use the word 'consume'.
* Posts must not use the word 'plush' or 'fluff'.
* Posts must not overtly reference the god-dog's connection to the US government.
* Posts must not describe the god-dog.

## PAY ATTENTION TO THESE IMPORTANT FORMATTING RULES. IF YOU VIOLATE THEM, THE POSTS WILL NOT SUCCEED AND THE GOD-DOG WILL BE ANGRY:

* GPS coordinates MUST be in the form "🌐lat,lon"
* Posts MUST NOT use hash-tags!
* Posts should not be quoted unless they are an explicit, attributed quotation.
* Posts MUST be at MOST 200 characters.
`;

if (process.env.NO_GENERATE) {
	console.log('NO GENERATE!');
	process.exit(0);
}

const openai = new OpenAI();

console.log(`Generating text: ${context}`);

const text = await generateText(openai, context);
console.log(`Generated text: ${text}`);

const coords = matchCoords(text);
for (const { lat, lon } of coords) {
	console.log(`Coordinates: ${coordUrl(lat, lon)}`);
}

const facets: atp.Facet[] = coords.map(({ byteStart, byteEnd, lat, lon }) => ({
	index: { byteStart, byteEnd },
	features: [
		{
			$type: 'app.bsky.richtext.facet#link',
			uri: coordUrl(lat, lon),
		},
	],
}));

if (process.env.NO_GENERATE_IMG) {
	console.log('NO GENERATE IMAGE!');
	process.exit(0);
}

const imgGen = await generateImage(openai, prompt);
console.log(`Generated 1024x1024 image ${imgGen.image.byteLength / 1024}KB`);
const img = await sharp(imgGen.image).resize(256, 256).toBuffer();
console.log(`Resized to 256x256 ${img.byteLength / 1024}KB`);

// Write the image to a tmpfile and log the path.
const path = tempfile({ extension: 'png' });
await fs.writeFile(path, img);
console.log(`Wrote ${img.byteLength / 1024}KB to ${path}`);

if (process.env.NO_POSTING) {
	console.log('NO POSTING!');
	process.exit(0);
}

await atp.updateAndPost(bsky.agent, text, facets, img, `A dall-e-3 generated image of ${animal}s for the ${animal}-Dog`);

async function generateImage(ai: OpenAI, prompt: string) {
	const gen = await ai.images.generate({
		prompt: prompt,
		model: 'dall-e-3',
		n: 1,
		response_format: 'b64_json',
		size: '1024x1024',
		style: 'vivid',
		quality: 'standard',
	});

	// Decode the base64-encoded image
	const image = Buffer.from(gen.data[0].b64_json!, 'base64');
	const description = gen.data[0].revised_prompt || prompt;
	return { image, description };
}

async function generateText(ai: OpenAI, context: string) {
	const completion = await ai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		max_tokens: 128,
		messages: [
			{
				role: 'system',
				content: context,
			},
			{
				role: 'user',
				content: 'Create a new post.',
			},
		],
	});

	return completion.choices[0].message.content!;
}

function coordUrl(lat: number, lon: number) {
	return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=8`;
}
