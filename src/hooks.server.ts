import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const query = event.request.url.split('?', 2)[1];
  const host = event.request.headers.get('host');
  event.locals.domain =
    host === 'olix0r.net' || host?.endsWith('.olix0r.net') || query === 'olix0r.net'
      ? 'olix0r.net'
      : 'ver.ooo';
  return resolve(event);
};
