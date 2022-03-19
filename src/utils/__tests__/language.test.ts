import each from 'jest-each';
import { getRandomLetter } from '../language';

describe('getRandomLetter', () => {
  each`
    e      | v
    ${0}   | ${100}
    ${0.5} | ${1000}
    ${1}   | ${10000}
  `.test('easiness $e has max variance $v', ({ e, v }) => {
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
