import dotenv from 'dotenv';
import tempfile from 'tempfile';
import { promises as fs } from 'fs';
import sharp from 'sharp';

import * as atp from './atp.js';
import * as dog from './dog.js';
import * as dogt from './dog.types.js';

dotenv.config();

const lores = [
	'The X-Files',
	'Space Ghost Coast to Coast',
	'Venture Bros.',
	'Kids in the Hall',
	'Buffy the Vampire Slayer',
	'The Fifth Element',
	'Buckaroo Banzai',
	'Ren & Stimpy',
];
const lore = lores[Math.floor(Math.random() * lores.length)];
console.log(`Using lore: ${lore}`);

// Ensure we can log in to Bluesky before generating an image.
const bsky = await atp.login(process.env.BLUESKY_USER!, process.env.BLUESKY_PASS!);
console.log(`Logged into Bluesky as ${bsky.handle} (${bsky.did})`);

const update = await dog.generate(lore);

if (process.env.NO_POSTING) {
	console.log('NO POSTING!');
	// Write the image to a tmpfile and log the path.
	const path = tempfile({ extension: 'png' });
	const avatar = update.avatar.image;
	await fs.writeFile(path, avatar);
	console.log(`Wrote ${avatar.byteLength / 1024}KB to ${path}`);
	process.exit(0);
}

const avatar = await sharp(update.avatar.image).resize(256, 256).toBuffer();
const banner = await sharp(update.banner.image).resize(256, 256).toBuffer();

const [avatarRef, bannerRef] = await Promise.all([avatar, banner].map((img) => bsky.uploadBlob(img, 'image/png')));

await Promise.all([bsky.updateProfile({ avatar: avatarRef, banner: bannerRef, ...update.profile }), post(bsky, update.post, avatarRef)]);

async function post(bsky: atp.Atp, post: dogt.Post, image: atp.BlobRef) {
	const facets = await bsky.detectFacets(update.post.text);

	for (const { text, lat, lon } of post.locationRefs) {
		const start = post.text.indexOf(text);
		if (start === -1) {
			continue;
		}

		const end = start + text.length;

		facets.push({
			index: {
				byteStart: Buffer.byteLength(post.text.substring(0, start), 'utf8'),
				byteEnd: Buffer.byteLength(post.text.substring(0, end), 'utf8'),
			},
			features: [
				{
					$type: 'app.bsky.richtext.facet#link',
					uri: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=8`,
				},
			],
		});
	}

	facets.sort((a, b) => a.index.byteStart - b.index.byteStart);

	await bsky.post(post.text, facets, {
		image,
		alt: `A dall-e-3 generated image of ${update.animal}s for the ${update.animal}-Dog`,
	});
}
