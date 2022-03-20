import { getRandomLetter, getRandomLetters, getWordList } from '../language';
import { MinLength } from '../types';

describe('getRandomLetter', () => {
  test.each`
    e      | v
    ${0}   | ${100}
    ${0.5} | ${1000}
    ${1}   | ${10000}
  `('easiness $e has max variance $v', ({ e, v }) => {
    const freqs: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const letter = getRandomLetter(e);
      freqs[letter] = (freqs[letter] ?? 0) + 1;
    }

    const occurrences = Object.values(freqs);
    const count = occurrences.length;
    const mean = occurrences.reduce((acc, curr) => acc + curr, 0) / count;
    const variance =
      occurrences
        .map((k) => (k - mean) ** 2)
        .reduce((acc, curr) => acc + curr, 0) / count;

    expect(variance).toBeLessThan(v);
  });
});

describe('wordlist', () => {
  test.each<MinLength>([3, 4, 5])('min length %d', (minLength) => {
    const minWordLength = Math.min(
      ...getWordList(minLength).map((w) => w.length)
    );
    expect(minWordLength).toEqual(minLength);
  });
});

describe('getRandomLetters', () => {
  test('gives the right length', () => {
    const length = 15;
    expect(getRandomLetters(length, 1)).toHaveLength(length);
  });

  test('is random', () => {
    const getLetters = () => getRandomLetters(5, 0.5);
    // chance of this test failing due to randomness is approx 26^5 (less due to letter frequencies)
    const words = new Array(5).fill(0).map(getLetters);
    const equalsFirstEl = words.map((word) => word === words[0]);
    expect(equalsFirstEl).toContain(false);
  });
});
