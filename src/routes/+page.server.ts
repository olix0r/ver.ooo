import type { PageServerLoad } from './$types';
import { AtpAgent } from '@atproto/api';
import { env } from '$env/dynamic/private';

async function loadBlueskyProfile(handle: string) {
  if (!env.BLUESKY_USER || !env.BLUESKY_PASS) {
    throw new Error('BLUESKY_USER and BLUESKY_PASS must be set');
  }

  console.log(`Logging in to bsky.social as ${env.BLUESKY_USER}`);
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: env.BLUESKY_USER,
    password: env.BLUESKY_PASS,
  });

  console.log(`Loading bluesky profile for ${handle}`);
  const rsp = await agent.resolveHandle({ handle });
  const profile = await agent.getProfile({ actor: rsp.data.did });
  return profile.data;
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  const email = locals.domain === 'olix0r.net' ? 'ver@olix0r.net' : 'oli@ver.ooo';
  let avatar = '/favicon.png';

  try {
    const profile = await loadBlueskyProfile(locals.domain);
    if (profile.avatar) {
      avatar = profile.avatar!;
    }

    // Prevent needless re-fetching of the profile.
    setHeaders({
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    });
  } catch (e) {
    console.error(`Failed to load bluesky profile for ${locals.domain}: ${e}`);

    // Retry in 10 minutes.
    setHeaders({
      'cache-control': 'public, max-age=600',
    });
  }

  return {
    email,
    avatar,
  };
};
