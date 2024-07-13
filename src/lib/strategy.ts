// Based on Brian Eno and Peter Schmidt's Oblique Strategies.
import { strategies } from './strategies.json';

function stableSeed(): number {
  const date = new Date();
  return Math.floor(date.getTime() / (15 * 60 * 1000));
}

function prng(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/// Returns a random number between 0 and strategies.length, that will be stable for 15 minutes.
function stableRandomStrategy(): string {
  const idx = Math.floor(prng(stableSeed()) * strategies.length);
  return strategies[idx];
}

export function strategy(idx?: number): string {
  if (idx === undefined) {
    return stableRandomStrategy();
  }
  return strategies[idx % strategies.length];
}
