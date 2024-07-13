import type { PageLoad } from './$types';
import { strategy } from '$lib/strategy';

export const load: PageLoad = ({ url }) => {
  const idx = url.searchParams.get('idx');
  const index = idx ? Number.parseInt(idx) : undefined;
  return {
    index,
    strategy: strategy(index),
  };
};
