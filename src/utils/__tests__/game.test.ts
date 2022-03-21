import { vec } from '../../jest/skia';
import {
  addIncomingChars,
  findWords,
  isNextTo,
  removeBlankSpaces,
  transpose,
} from '../game';
import { Direction, MatchedWord, MinLength } from '../types';

describe('transpose', () => {
  test.each([
    [['abc'], ['a', 'b', 'c']],
    [
      ['a ', ' b'],
      ['a ', ' b'],
    ],
    [[], []],
    [
      ['abc', 'def'],
      ['ad', 'be', 'cf'],
    ],
  ])('%p results in %p', (rows, expected) => {
    expect(transpose(rows)).toEqual(expected);
  });
});

describe('findWords', () => {
  test.each<[string[], MinLength, MatchedWord[]]>([
    [
      ['BAR'],
      3,
      [
        {
          chars: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
          ],
          word: 'BAR',
        },
      ],
    ],
    [
      ['WORDRAW'],
      4,
      [
        {
          chars: [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
          ],
          word: 'DRAW',
        },
      ],
    ],
    [['TEST'], 5, []],
  ])('%p with min length %d results in %j', (rows, minLength, expected) => {
    const words = findWords(rows, 0, minLength);
    expect(words).toEqual(expected);
  });

  test('rotated word', () => {
    const rows = ['OW    TEST   R'];
    const words = findWords(rows, 1, 3);
    expect(words.map(({ word }) => word).sort()).toEqual(['ROW', 'TEST']);
  });
});

describe('addIncomingChars', () => {
  let chars: string, pos: number, rowWidth: number, direction: Direction;
  beforeEach(() => {
    chars = 'AB';
    pos = 3;
    rowWidth = 5;
    direction = Direction.RIGHT;
  });

  describe.each([
    [Direction.LEFT, ['   BA']],
    [Direction.RIGHT, ['   AB']],
    [Direction.UP, ['   B ', '   A ']],
    [Direction.DOWN, ['   A ', '   B ']],
  ])('%#', (d, expected) => {
    test(`test ${Direction[d]}`, () => {
      const rows: string[] = [];
      addIncomingChars({ direction: d, chars, rowWidth, rows, pos });
      expect(rows).toEqual(expected);
    });
  });

  test('at end of row', () => {
    pos = 4;
    const rows: string[] = [];
    addIncomingChars({ direction, chars, rowWidth, rows, pos });
    expect(rows[0]).toEqual('B   A');
  });

  test('at start of row', () => {
    pos = 0;
    const rows: string[] = [' BCDE'];
    addIncomingChars({ direction, chars, rowWidth, rows, pos });
    expect(rows[0]).toEqual('AB   ');
  });
});

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
