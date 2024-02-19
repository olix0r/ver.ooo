import dotenv from 'dotenv';
import atp from '@atproto/api';
import OpenAI from 'openai';
import tempfile from 'tempfile';
import { promises as fs } from 'fs';
import sharp from 'sharp';

import { matchCoords, CoordMatch } from './coords.js';

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
		model: 'gpt-4-turbo-preview',
		max_tokens: 64,
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

async function bskyLogin(agent: atp.BskyAgent, identifier: string, password: string) {
	const login = await agent.login({ identifier, password });
	if (!login.success) {
		throw new Error('Login failed');
	}
	return login.data;
}

async function upload(agent: atp.BskyAgent, img: Buffer) {
	console.log('Uploading', img.byteLength / 1024, 'KB');
	const blobRsp = await agent.uploadBlob(img, { encoding: 'image/png' });
	if (!blobRsp.success) {
		throw new Error('Blob upload failed');
	}
	return blobRsp.data.blob;
}

async function updateProfile(agent: atp.BskyAgent, image: atp.BlobRef) {
	await agent.upsertProfile((existing) => {
		if (!existing) {
			return {
				avatar: image,
			};
		}
		existing.avatar = image;
		return existing;
	});
}

async function postImage(agent: atp.BskyAgent, image: atp.BlobRef, text: string, alt: string, coords: CoordMatch[]) {
	return await agent.post({
		text,
		facets: coords.map(({ start, end, lat, lon }) => ({
			index: { byteStart: start, byteEnd: end },
			features: [
				{
					$type: 'app.bsky.richtext.facet#link',
					uri: coordUrl(lat, lon),
				},
			],
		})),
		embed: {
			$type: 'app.bsky.embed.images',
			images: [{ image, alt }],
		},
	});
}

function coordUrl(lat: number, lon: number) {
	return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=8`;
}

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
	'praying-mantis',
	'scorpion',
	'tiger',
	'lion',
	'cheetah',
	'leopard',
	'jaguar',
	'panther',
	'cougar',
	'elephant',
	'horse',
	'zebra',
	'giraffe',
	'rhinoceros',
	'geoduck',
];
const animal = animals[Math.floor(Math.random() * animals.length)];

const vibes = ['vibrant', 'psychedelic', 'cosmic', 'new age', 'retro', 'cyberpunk', 'goth', 'halucinated', 'cybernetic'];
const vibe = vibes[Math.floor(Math.random() * vibes.length)];

const styles = ['web', 'pixel', 'glitch', 'dadaist', 'renaissance', 'modernist', 'minimalist', 'post-modernist'];
const style = styles[Math.floor(Math.random() * styles.length)];

const lores = [
	'The X-Files',
	'Space Ghost Coast to Coast',
	'Venture Bros.',
	'Kids in the Hall',
	"MTV's The State",
	'Reno 911',
	'Buffy the Vampire Slayer',
	'Angel',
	'LOST',
	'Fringe',
	'Quantum Leap',
	'The Matrix',
	'The Fifth Element',
];
const lore = lores[Math.floor(Math.random() * lores.length)];

const prompt = `In the style of ${vibe} ${style} art, an image featuring a background patterned with
${animal}-shaped stuffed animals that have been torn and mangled by a dog, with stuffing flowing out of their wounds.

Overlayed in the foreground is a saintly depiction of a small black pit-lab mix dog's head.

Within the dog's head is a psychedelic depiction of the dog's chakra energy, symbolizing its connection to cosmic oneness.

The art style should feature vibrant, psychedelic colors and a web appearance.`;
console.log(`Prompt: ${prompt}`);

const context = `You are the social media manager for a cult-leader god-dog.

Some facts about the god-dog:

* It is a cosmic being, connected to the oneness of all of the universe. His followers span the darkweb and internet.
* It's a cybernetic entity, exisitng partially in code, partially in the physical world, and partially in the cosmic realm.
* Its followers offer up stuffed ${animal}s for the god-dog to destroy.
* It DEMANDS ${animal}s.
* It is ineffable.
* It is confident in its knowledge of the universe and its place in it.
* ${lore} is believed to be sacred by its followers, encoding deep truths about the universe.
* The god-dog was discovered as a part of The Stargate Project, and has been a part of the US government's secret projects since the 1970s.

Your main job is to solicit ${animal}s for the god-dog, specifying a location for them to be collected for consumption.
The god-dog will destroy the ${animal}s and absorb their energy, expelling their fluff in a spectacle for the followers to harvest.

Locations are chosen to either be near a historically supernatural location, or to be the location of a US government military intelligence facility.

Posting rules:

* Posts are written from the perspective of the god-dog, in the god-dog's all-knowing voice.
* Posts bestow blessings and felicitations upon the world, while demanding tribute.
* Posts use simple and direct language, with a charismatic and confident tone.
* Posts must specify the GPS coordinates in the form "🌐[lat, lon]"
* Posts may include symbols, utf glitch art, emoji, typescript and rust code samples.
* Posts should include deep references to '${lore}', so that the initiated will recognize the connection.
* Posts must not mention "${lore}" by name.
* Posts are SHORT. They MUST be at MOST 140 characters.
* Posts must never name or try to describe the god-dog. The god-dog is ineffable. Even the term 'god-dog' is a misnomer.
* Posts must not use the word 'cult' or 'cult-leader'. The relationship between the god-dog and its followers is ineffable.
* Posts must not use the word 'followers'.
* Posts must not use the word 'hacker' or 'hack'.
* Posts must not use the word 'solicit'.
* Posts must not use the word 'consume'.
* Posts must not use the word 'plush' or 'fluff'.
* Posts must not overtly reference the god-dog's connection to the US government.
* Posts must not describe the god-dog.

IMPORTANT Formatting notes:

* GPS coordinates MUST be in the form "🌐[lat, lon]"
* Posts MUST NOT use hash-tags!
* Posts should not be quoted unless they are an explicit, attributed quotation.
`;

if (process.env.NO_GENERATE) {
	console.log('NO GENERATE!');
	process.exit(0);
}

// Ensure we can log in to Bluesky before generating an image.
const bsky = new atp.BskyAgent({
	service: 'https://bsky.social',
});

const openai = new OpenAI();

const login = await bskyLogin(bsky, process.env.BLUESKY_USER!, process.env.BLUESKY_PASS!);
console.log(`Logged into Bluesky as ${login.handle} (${login.did})`);

console.log(`Generating text: ${context}`);
const text = await generateText(openai, context);
console.log(`Generated text: ${text}`);

const coords = matchCoords(text);
for (const { lat, lon } of coords) {
	console.log(`Coordinates: ${coordUrl(lat, lon)}`);
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

const ref = await upload(bsky, img);
console.log(`Uploaded image ref ${ref}`);

await updateProfile(bsky, ref);
console.log('Updated profile avatar');

const p = await postImage(bsky, ref, text, `A dall-e-3 generated image of ${animal}s for the ${animal}-Dog`, coords);
console.log(`Posted ${p}`);
