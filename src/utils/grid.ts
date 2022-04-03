import { Vector } from '@shopify/react-native-skia';
import { setCharAt } from './string';
import { CharDesinations, MatchedWord } from './types';

/**
 * modifies `rows` by searching in the `col` above `row` and swapping the first non-space character
 */
const pullCharacterDownFromAbove = (
  rows: string[],
  row: number,
  col: number
) => {
  for (let searchRow = row - 1; searchRow >= 0; searchRow--) {
    if (rows[searchRow][col] !== ' ') {
      // found a character
      rows[row] = setCharAt(rows[row], col, rows[searchRow][col]);
      rows[searchRow] = setCharAt(rows[searchRow], col, ' ');
      return;
    }
  }
};

export const removeBlankSpaces = (rows: string[]): string[] => {
  if (rows.length === 0) {
    return rows;
  }

  const ret = [...rows];
  for (let col = 0; col < ret[0].length; col++) {
    for (let row = ret.length - 1; row >= 0; row--) {
      if (ret[row][col] === ' ') {
        // found a space
        pullCharacterDownFromAbove(ret, row, col);
      }
    }
  }

  // Remove blank spaces from the top
  while (ret.length && !ret[0].trim()) {
    ret.shift();
  }

  return ret;
};

export const removeWords = (words: MatchedWord[], rows: string[]): string[] => {
  if (words.length === 0) {
    return rows;
  }

  const clonedRows = [...rows];
  words.forEach(({ chars }) => {
    chars.forEach(({ x, y }) => {
      clonedRows[y] = setCharAt(clonedRows[y], x, ' ');
    });
  });

  return clonedRows;
};

export const isNextTo = (
  v1: Vector,
  v2: Vector,
  rowWidth: number,
  allowDiagonal: boolean
) => {
  // Can't be more than 1 away vertically
  const diffY = Math.abs(v1.y - v2.y);
  if (diffY > 1) {
    return false;
  }

  // Can't be more than 1 away horizontally (including wraparound)
  let diffX = Math.abs(v1.x - v2.x);
  if (diffX === rowWidth - 1) {
    diffX = 1;
  }
  if (diffX > 1) {
    return false;
  }

  if (diffX === 1 && diffY === 1) {
    return allowDiagonal;
  }

  return true;
};

/**
 *
 * @returns the destination row for each non-space character in the provided rows after spaces have been removed.
 * @example
 * const rows = ['A_BC',
 *               '__D_'];
 * findDests(rows)
 * // [ [1,         undefined, 0, 1],
 * //   [undefined, undefined, 1, undefined] ]
 * //
 * // The resulting rows after dropping characters is
 * // [ ['__B_']
 * //   ['A_DC'] ]
 */
export const findDests = (rows: string[]): CharDesinations => {
  if (!rows.length) {
    return [];
  }

  const rowWidth = rows[0].length;
  const rowCount = rows.length;

  // start with an array of undefineds
  const dests: CharDesinations = new Array(rowCount)
    .fill(undefined)
    .map(() => new Array(rowWidth).fill(undefined));

  for (let col = 0; col < rowWidth; col++) {
    // start at the bottom and go up
    let destRow = rowCount - 1;
    for (let row = rowCount - 1; row >= 0; row--) {
      if (rows[row][col] !== ' ') {
        dests[row][col] = destRow--;
      }
    }
  }

  return dests;
};
