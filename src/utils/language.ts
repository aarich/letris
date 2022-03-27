import words10 from 'wordlist-english/english-words-10.json';
import words20 from 'wordlist-english/english-words-20.json';
import words35 from 'wordlist-english/english-words-35.json';
import words40 from 'wordlist-english/english-words-40.json';
import words50 from 'wordlist-english/english-words-50.json';
import words55 from 'wordlist-english/english-words-55.json';
import words60 from 'wordlist-english/english-words-60.json';
import words70 from 'wordlist-english/english-words-70.json';
import { MatchedWord, MinLength } from './types';

const WORDS = [
  ...words10,
  ...words20,
  ...words35,
  ...words40,
  ...words50,
  ...words55,
  ...words60,
  ...words70,
].map((word) => word.toUpperCase());

const WORDS_GTE_3 = WORDS.filter((w) => w.length >= 3);
const WORDS_GTE_4 = WORDS_GTE_3.filter((w) => w.length >= 4);
const WORDS_GTE_5 = WORDS_GTE_4.filter((w) => w.length >= 5);
export const getWordList = (minLength: MinLength): string[] =>
  ({ [3]: WORDS_GTE_3, [4]: WORDS_GTE_4, [5]: WORDS_GTE_5 }[minLength]);

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

/**
 * @param easiness a number between 0 and 1, 0 means no freq correlation, 1 means 100% freq correlation
 * @returns a single letter
 */
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

/**
 * @param newCharCount number of letters to return
 * @param easiness a number between 0 and 1, 0 means no freq correlation, 1 means 100% freq correlation
 */
export const getRandomLetters = (
  newCharCount: number,
  easiness: number
): string => {
  let result = '';
  for (let i = 0; i < newCharCount; i++) {
    result += getRandomLetter(easiness);
  }
  return result;
};

export const validateWordSelection = (
  words: MatchedWord[],
  minLength: MinLength
) => {
  const wordList = getWordList(minLength);
  words.forEach(({ word }) => {
    if (word.length < minLength) {
      throw new Error(`"${word}" is too short`);
    }
    if (!wordList.includes(word)) {
      throw new Error(`"${word}" not found`);
    }
  });
};

const ones = ['A', 'E', 'I', 'L', 'N', 'R', 'U', 'O', 'S', 'T'];
const twos = ['D', 'G'];
const threes = ['B', 'C', 'M', 'P'];
const fours = ['F', 'H', 'V', 'W', 'Y'];
const fives = ['K'];
const eights = ['J', 'X'];

export const getLetterScore = (letter: string) => {
  if (ones.includes(letter)) {
    return 1;
  } else if (twos.includes(letter)) {
    return 2;
  } else if (threes.includes(letter)) {
    return 3;
  } else if (fours.includes(letter)) {
    return 4;
  } else if (fives.includes(letter)) {
    return 5;
  } else if (eights.includes(letter)) {
    return 8;
  } else {
    return 10;
  }
};
