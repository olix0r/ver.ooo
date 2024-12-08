import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    email: locals.domain === 'olix0r.net' ? 'ver@olix0r.net' : 'oli@ver.ooo',
  };
};
