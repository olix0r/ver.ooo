import dotenv from 'dotenv';
import atp from '@atproto/api';;
import OpenAI from 'openai';
import tempfile from 'tempfile';
import { promises as fs } from 'fs';
import sharp from 'sharp';

async function generate(api: OpenAI, prompt: string) {
	const airsp = await api.images.generate({
		prompt: prompt,
		model: "dall-e-3",
		n: 1,
		response_format: 'b64_json',
		size: '1024x1024',
		style: 'vivid',
		quality: 'standard',
	});

	// Decode the base64-encoded image
	const imageData = airsp.data[0].b64_json!;
	return Buffer.from(imageData, 'base64');
}

async function bskyLogin(agent: atp.BskyAgent, identifier: string, password: string) {
	const login = await agent.login({ identifier, password });
	if (!login.success) {
		throw new Error("Login failed");
	}
	return login.data;
}

async function upload(agent: atp.BskyAgent, img: Buffer) {
	// // Write the image to a tmpfile and log the path.
	// const path = tempfile({ extension: 'png' });
	// await fs.writeFile(path, img);
	// console.log("Wrote ", img.byteLength / 1024, "KB to", path);

	console.log("Uploading", img.byteLength / 1024, "KB");
	const blobRsp = await agent.uploadBlob(img, { encoding: "image/png" });
	if (!blobRsp.success) {
		throw new Error("Blob upload failed");
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

async function post(agent: atp.BskyAgent, image: atp.BlobRef) {
	const alt = "vee ee ar dot oh oh oh";
	return await agent.post({
		text: "Woof.",
		embed: {
			$type: "app.bsky.embed.images",
			images: [{ image, alt }],
		},
	});
}

dotenv.config();

const animals = ["trout", "shark", "alligator", "manta-ray", "lobster", "soccer-ball", "salmon", "flamingo"];
const animal = animals[Math.floor(Math.random() * animals.length)];
const prompt = "In the style of psychedelic new age web art, an image featuring a background patterned with" +
	` ${animal}-shaped stuffed animals that have been torn and mangled by a dog, with stuffing flowing out of their wounds.` +
	" Overlayed in the foreground is a saintly depiction of a small black pit-lab mix dog's head." +
	" Within the dog's head is a psychedelic depiction of the dog's chakra energy, symbolizing its connection to cosmic oneness." +
	" The art style should feature vibrant, psychedelic colors and a web appearance.";
console.log(`Prompt: ${prompt}`);

if (process.env.NO_GENERATE) {
	console.log("NO GENERATE!");
	process.exit(0);
}

// Ensure we can log in to Bluesky before generating an image.
const bsky = new atp.BskyAgent({
	service: 'https://bsky.social'
});
const login = await bskyLogin(
	bsky,
	process.env.BLUESKY_USER!,
	process.env.BLUESKY_PASS!,
);
console.log(`Logged into Bluesky as ${login.handle} (${login.did})`);

const openai = new OpenAI();
const imgOrig = await generate(openai, prompt);
console.log(`Generated 1024x1024 image ${imgOrig.byteLength / 1024}KB`);

const img = await sharp(imgOrig).resize(256, 256).toBuffer();
console.log(`Resized to 256x256 ${img.byteLength / 1024}KB`);

// Write the image to a tmpfile and log the path.
const path = tempfile({ extension: 'png' });
await fs.writeFile(path, img);
console.log(`Wrote ${img.byteLength / 1024}KB to ${path}`);

if (process.env.NO_POSTING) {
	console.log("NO POSTING!");
	process.exit(0);
}

const ref = await upload(bsky, img);
console.log(`Uploaded image ref ${ref}`);

await updateProfile(bsky, ref);
console.log("Updated profile avatar");

const p = await post(bsky, ref);
console.log(`Posted ${p}`);
