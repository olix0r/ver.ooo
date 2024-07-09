import type { PageLoad } from './$types';

export const load: PageLoad = ({ data, url }) => {
  const idx = url.searchParams.get('idx');
  return {
    strategies: data.strategies,
    index: idx ? Number.parseInt(idx) : data.index,
  };
};
