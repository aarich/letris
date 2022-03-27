import { addIncomingChars, findWords } from '../game';
import { Direction, MatchedWord, MinLength } from '../types';

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
