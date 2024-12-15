import type { PageServerLoad } from './$types';
import { AtpAgent } from '@atproto/api';
import { env } from '$env/dynamic/private';


export const load: PageServerLoad = async ({ locals }) => {
  const email = locals.domain === 'olix0r.net' ? 'ver@olix0r.net' : 'oli@ver.ooo';

  try {
    console.log(`Logging in to bsky.social as ${process.env.BLUESKY_USER}`);
    const agent = new AtpAgent({ service: 'https://bsky.social' });
    await agent.login({
      identifier: env.BLUESKY_USER!,
      password: env.BLUESKY_PASS!,
    });

    console.log(`Loading profile for ${locals.domain}`);
    const rsp = await agent.resolveHandle({ handle: locals.domain });
    console.log(rsp);
    const actor = rsp.data.did;
    const profile = await agent.getProfile({ actor });
    console.log(profile);
    return {
      avatar: profile.data.avatar || 'static/favicon.png',
      email,
    };
  } catch (e) {
    console.error(e);
    return {
      avatar: null,
      email,
    };
  }
};
