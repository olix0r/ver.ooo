import atp from '@atproto/api';

export type BlobRef = atp.BlobRef;
export type Facet = atp.Facet;
export type FacetLink = atp.FacetLink;
export type FacetTag = atp.FacetTag;

export interface Atp {
  handle: string;
  did: string;

  followers(): Promise<Follower[]>;
  uploadBlob(png: Buffer, encoding: string): Promise<atp.BlobRef>;
  updateProfile(profile: Profile): Promise<void>;
  post(text: string, facets: atp.Facet[], image: ImageRef): Promise<{ uri: string }>;

  detectFacets(text: string): Promise<Facet[]>;
}

export interface Follower {
  handle: string;
  did: string;
  displayName?: string;
  description?: string;
}

export interface Profile {
  avatar?: atp.BlobRef;
  banner?: atp.BlobRef;
  description?: string;
  displayName?: string;
}

export interface ImageRef {
  image: atp.BlobRef;
  alt: string;
}

type Did = string;

export async function login(identifier: string, password: string): Promise<Atp> {
  const agent = new atp.BskyAgent({
    service: 'https://bsky.social',
  });
  const rsp = await agent.login({ identifier, password });
  if (!rsp.success) {
    throw new Error('Login failed');
  }
  const { handle, did } = rsp.data;
  return {
    handle,
    did,
    followers: () => followers(agent, did),
    uploadBlob: (img, enc) => uploadBlob(agent, img, enc),
    updateProfile: (profile) => updateProfile(agent, profile),
    post: (text, facets, image) => post(agent, text, facets, image),
    detectFacets: (text) => detectFacets(agent, text),
  };
}

async function uploadBlob(agent: atp.BskyAgent, img: Buffer, encoding: string) {
  console.log('Uploading', img.byteLength / 1024, 'KB');
  const blobRsp = await agent.uploadBlob(img, { encoding });
  if (!blobRsp.success) {
    throw new Error('Blob upload failed');
  }
  return blobRsp.data.blob;
}

async function updateProfile(agent: atp.BskyAgent, profile: Profile) {
  return await agent.upsertProfile((existing) => {
    if (!existing) {
      return {
        ...profile,
      };
    }

    if (profile.displayName) {
      existing.displayName = profile.displayName;
    }
    if (profile.description) {
      existing.description = profile.description;
    }
    if (profile.avatar) {
      existing.avatar = profile.avatar;
    }
    if (profile.banner) {
      existing.banner = profile.banner;
    }

    return existing;
  });
}

async function post(agent: atp.BskyAgent, text: string, facets: atp.Facet[], image: ImageRef) {
  return await agent.post({
    text,
    facets,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [{ ...image }],
    },
  });
}

async function followers(agent: atp.BskyAgent, actor: Did) {
  const rsp = await agent.getFollowers({ actor });
  if (!rsp.success) {
    throw new Error('Failed to fetch followers');
  }
  return rsp.data.followers.map((f) => ({ ...f }));
}

async function detectFacets(agent: atp.BskyAgent, text: string) {
  const rt = new atp.RichText({ text });
  await rt.detectFacets(agent);
  return rt.facets || [];
}
