import { vec } from '../../jest/skia';
import { findDests, isNextTo, removeBlankSpaces } from '../grid';

describe('removeBlankSpaces', () => {
  test.each([
    [['A B', '   '], ['A B']],
    [
      [' A B', 'C D ', 'E   ', '    '],
      ['C   ', 'EADB'],
    ],
  ])('%#: %p', (rows, expected) => {
    expect(removeBlankSpaces(rows)).toEqual(expected);
  });
});

describe('isNextTo', () => {
  test.each([
    [3, 3, 3, 3, false],
    [0, 1, 1, 0, true],
    [0, 0, 0, 1, false],
    [0, 0, 1, 0, false],
    [0, 8, 4, 9, true],
    [4, 0, 0, 0, false],
    [0, 0, 1, 0, false],
  ])(
    '%#: [%p, %p] is next to [%p, %p] when allowDiagonal is %p',
    (x1, y1, x2, y2, allowDiagonal) => {
      expect(isNextTo(vec(x1, y1), vec(x2, y2), 5, allowDiagonal)).toBe(true);
    }
  );

  test.each([
    [0, 1, 0, 3, true],
    [0, 3, 3, 3, true],
    [1, 0, 4, 0, true],
    [1, 0, 0, 1, false],
    [1, 1, 2, 2, false],
  ])(
    '%#: [%p, %p] is _not_ next to [%p, %p] when allowDiagonal is %p',
    (x1, y1, x2, y2, allowDiagonal) => {
      expect(isNextTo(vec(x1, y1), vec(x2, y2), 5, allowDiagonal)).toBe(false);
    }
  );
});

describe('findDests', () => {
  const u = undefined;
  test.each([
    [[], []],
    [
      ['A BC', '  D '],
      [
        [1, u, 0, 1],
        [u, u, 1, u],
      ],
    ],
    [['ABC '], [[0, 0, 0, u]]],
    [
      ['A ', ' B', 'C ', '  ', 'DE'],
      [
        [2, u],
        [u, 3],
        [3, u],
        [u, u],
        [4, 4],
      ],
    ],
  ])('%#: %p', (rows, expected) => {
    expect(findDests(rows)).toEqual(expected);
  });
});
