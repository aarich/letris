const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const;

const FREQUENCIES = [
  8167, 9659, 12441, 16694, 29396, 31624, 33639, 39733, 46699, 46852, 47624,
  51649, 54055, 60804, 68311, 70240, 70335, 76322, 82649, 91705, 94463, 95441,
  97801, 97951, 99925, 100000,
] as const;

const INTERVAL = FREQUENCIES[FREQUENCIES.length - 1] / LETTERS.length;

type LookupMap = Record<typeof LETTERS[number], number>;

/**
 *
 * @param easiness a number between 0 and 1, 0 means no freq correlation, 1 means 100% freq correlation
 * @returns lookup table with min = 0 and max = 100000
 */
const buildLookup = (easiness: number): LookupMap => {
  const lookup: Partial<LookupMap> = {};

  const freqMultiplier = easiness;
  const fracMultiplier = 1 - easiness;

  const frequencies = FREQUENCIES.map(
    (f, i) => f * freqMultiplier + i * INTERVAL * fracMultiplier
  );

  for (let i = 0; i < LETTERS.length; i++) {
    lookup[LETTERS[i]] = frequencies[i];
  }

  return lookup as LookupMap;
};

export const getRandomLetter = (easiness: number): typeof LETTERS[number] => {
  const random = Math.random() * 100000;

  const lookup = buildLookup(easiness);

  for (const letter in lookup) {
    if (lookup[letter as keyof typeof lookup] > random) {
      return letter as keyof typeof lookup;
    }
  }
  return 'A';
};
