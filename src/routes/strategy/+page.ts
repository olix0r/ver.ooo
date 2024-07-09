import type { PageLoad } from './$types';
import { strategy } from '$lib/strategy';

export const load: PageLoad = ({ url }) => {
  const idx = url.searchParams.get('idx');
  return {
    strategy: strategy(idx ? Number.parseInt(idx) : undefined),
  };
};
