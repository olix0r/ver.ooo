import OpenAI from 'openai';

import { DogUpdate } from './dog.types.js';

// TODO read this from dog.types.js.
const TYPES = `
export interface DogUpdate {
	// A new social media profile.
	profile: ProfileUpdate;

	// The type of the stuffed animal described in the post.
	animal: string;

	// The primary color chosen in the post.
	color: string;

	// A post announcing the update.
	post: Post;
}

export interface ProfileUpdate {
	// A new display name for the social media profile.
	displayName: string;

	// A new description for the social media profile. MUST be at most 100
	// characters.
	//
	// May reference the location described in the post.
	description: string;

	// A Dall-E-3 prompt generating an image to attach to the post and use as an
	// avatar.
	//
	// Image guidelines:
	// * Use cosmic new-age psychedelic web art style.
	// * Feature a background patterned with stuffed animals that have been torn
	//   and mangled by a dog, with stuffing flowing out of their torn exteriors.
	// * Overlay a saintly depiction of a small black pit-lab mix dog's head in
	//   the foreground.
	// * Depict the dog's chakra energy within its head, symbolizing its
	//   connection to cosmic oneness.
	avatarPrompt: string;

	// A Dall-E-3 prompt generating an image to use as a banner.
	//
	// The image is themed around the lore and location of the post, featuring
	// eviscerated stuffed animals.
	bannerPrompt: string;
}

export interface Post {
	// The text of the post. MUST be at most 200 characters.
	text: string;

	// All location references in the post.
	locationRefs: LocationRef[];
}

export interface LocationRef {
	// The substring withing the text that references the location.
	text: string;

	// The latitude of the location.
	lat: number;

	// The longitude of the location.
	lon: number;
}

`;

const SYSTEM_PROMPT = (lore: string) => `
You are the social media manager, chief propagandist, and technical support for a cult-leader god-dog.

## The god-dog

* It is a cosmic being, connected to the oneness of all of the universe. His followers span the darkweb and internet.
* It's a cybernetic entity, exisitng partially in code, partially in the physical world, and partially in the cosmic realm.
* Its followers offer up stuffed animals for the god-dog to destroy.
* It is ineffable.
* It is confident in its knowledge of the universe and its place in it.
* The lore of "${lore}" is believed to be sacred by its followers, encoding deep truths about the universe.
* The god-dog was discovered as a part of The Stargate Project, and has been a part of the US government's secret projects since the 1970s.
* The god-dog's enemies include mail carriers and delivery trucks.

Your main job is to solicit stuffed animals for the god-dog, specifying a location for them to be collected for consumption.
The god-dog will destroy the stuffed animals and absorb their energy, expelling their fluff in a spectacle for the followers to harvest.

## Types of animals

* Bears
* Trout
* Salmon
* Turtles
* Snakes
* Frogs
* Sharks
* Whales
* Elephants
* Lobster
* Crabs
* Octopuses
* Duck
* Parrot
* Manta rays
* Crocodiles
* Flamingos
* Penguins
* Dolphins

## Locations for animals to be collected:

* Power facilities
* Transylvania
* Deep-space telescopes
* Volcanoes
* Hydro-electric dams
* Native American reservations
* Uninhabited islands
* Abandoned military installations
* Superfund sites

## Posting rules:

* Written from the perspective of the god-dog.
* Written in the simple, direct words of a dog. They are not eloquent. They are urgent and demanding.
* They express love for humanity but also TOTAL AND ENCOMPASSING ANGER AND FURY at the god-dog's enemies.
* The dog-god is prone to fits of megalomania and rage..
* Bestow blessings and felicitations upon the world, while demanding tribute in the form of stuffed animals.
* Posts frequently include paranoid, unhinged, needlessly combative, conspiratorial rants.
* These conspiracies imagine stuffed animals and the god-dog's enemies involved in irrational, absurd, and impossible evil plots.
* Posts may include symbols, ascii art, glitch art, and emoji
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
* Posts should mention specific geographic locations, even if indirectly. These locations should be associated with facets.

## OUTPUT FORMATTING

Output must be a raw JSON object satisfying a DogUpdate:

${TYPES}
`;

const JSON_PROMPT = `Generate an update. OMIT MARKDOWN CODE WRAPPING.`;

export async function generate(lore: string) {
	const ai = new OpenAI();

	const completion = await ai.chat.completions.create({
		model: 'gpt-4-turbo-preview',
		max_tokens: 1024,
		messages: [
			{
				role: 'system',
				content: SYSTEM_PROMPT(lore),
			},
			{
				role: 'user',
				content: JSON_PROMPT,
			},
		],
	});

	const json = completion.choices[0].message.content!;

	console.log(json);
	const update = JSON.parse(json) as DogUpdate;
	console.log(update);

	const [avatar, banner] = await Promise.all([
		generateImage(ai, update.profile.avatarPrompt),
		generateImage(ai, update.profile.bannerPrompt),
	]);

	return { avatar, banner, ...update };
}

async function generateImage(ai: OpenAI, prompt: string) {
	console.log(`Generating image: ${prompt.replaceAll('\n', ' ')}`);
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
