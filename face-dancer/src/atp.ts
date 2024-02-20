import atp from '@atproto/api';

export type Facet = atp.Facet;

export async function login(identifier: string, password: string) {
	const agent = new atp.BskyAgent({
		service: 'https://bsky.social',
	});
	const rsp = await agent.login({ identifier, password });
	if (!rsp.success) {
		throw new Error('Login failed');
	}
	return { agent, login: rsp.data };
}

async function uploadBlob(agent: atp.BskyAgent, img: Buffer) {
	console.log('Uploading', img.byteLength / 1024, 'KB');
	const blobRsp = await agent.uploadBlob(img, { encoding: 'image/png' });
	if (!blobRsp.success) {
		throw new Error('Blob upload failed');
	}
	return blobRsp.data.blob;
}

async function updateProfile(agent: atp.BskyAgent, image: atp.BlobRef) {
	return await agent.upsertProfile((existing) => {
		if (!existing) {
			return {
				avatar: image,
			};
		}
		existing.avatar = image;
		return existing;
	});
}

export async function updateAndPost(agent: atp.BskyAgent, text: string, facets: atp.Facet[], imgBuf: Buffer, alt: string) {
	const image = await uploadBlob(agent, imgBuf);
	await updateProfile(agent, image);
	return await agent.post({
		text,
		facets,
		embed: {
			$type: 'app.bsky.embed.images',
			images: [{ image, alt }],
		},
	});
}
