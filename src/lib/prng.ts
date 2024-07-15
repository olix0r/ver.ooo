import seedrandom from 'seedrandom';

export interface PRNG {
  shuffle<T>(array: T[]): T[];
}

export function prng(seed?: string): PRNG {
  if (!seed) {
    return {
      shuffle<T>(array: T[]): T[] {
        return array;
      }
    };
  }

  const rng = seedrandom(seed);
  return {
    // Fisher-Yates shuffle algorithm
    shuffle<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  };
}
