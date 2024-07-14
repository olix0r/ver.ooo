import seedrandom from 'seedrandom';
import { strategies } from './strategies.json';

type PRNG = () => number;

export function dateStablePRNG(granularity: number): PRNG {
  const now = new Date();
  const start = new Date(Math.floor(now.getTime() / granularity));
  const rng = seedrandom(start.toISOString());
  return () => Math.floor(rng() * strategies.length);
}
