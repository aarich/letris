import { vec, Vector } from '@shopify/react-native-skia';
import { getRandomLetters, getWordList } from './language';
import {
  Direction,
  Incoming,
  isVertical,
  MatchedWord,
  MinLength,
} from './types';

export const FONT_SIZE = 32;
export const CHAR_DROP_MS = 300;
export const WORD_MATCH_MS = 400;

export const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

export const transpose = (rows: string[]): string[] => {
  if (rows.length === 0) {
    return rows;
  }

  const ret: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _c of rows[0]) {
    ret.push('');
  }

  rows.forEach((row) => {
    for (let c = 0; c < row.length; c++) {
      ret[c] += row[c];
    }
  });

  return ret;
};

const findWordsV = (
  rows: string[],
  found: MatchedWord[],
  wordList: string[]
) => {
  const transposed = transpose(rows);
  return findWordsH(transposed, found, wordList);
};

const findWordsH = (
  rows: string[],
  found: MatchedWord[],
  wordList: string[]
) => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (const word of wordList) {
      const index = row.indexOf(word);
      if (index >= 0) {
        const chars: Vector[] = [];
        let newRow = row;
        // Replace with spaces to avoid double counting characters
        for (let j = 0; j < word.length; j++) {
          newRow = setCharAt(newRow, j + index, ' ');
          chars.push(vec(j + index, i));
        }
        rows[i] = newRow;
        found.push({ word, chars });
        findWordsH(rows, found, wordList);
        // start over word search
        return;
      }
    }
  }
};

const pullDown = (rows: string[], row: number, col: number) => {
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
        // found a space,
        pullDown(ret, row, col);
      }
    }
  }

  // Remove blank rows at the top
  while (ret.length && ret[0].match(/^ *$/)) {
    ret.shift();
  }

  return ret;
};

/** modifies the rows by removing the words matched. Returns a list of words made */
export const findWords = (
  rows: string[],
  rotations: number,
  minLength: MinLength
): MatchedWord[] => {
  const adaptedRows = rows.map((row) => {
    let adaptedRow = '';
    for (let i = 0; i < row.length; i++) {
      adaptedRow += row[(row.length + i - rotations) % row.length];
    }
    return adaptedRow;
  });
  const wordList = getWordList(minLength);
  const found: MatchedWord[] = [];
  findWordsH(adaptedRows, found, wordList);
  findWordsV(adaptedRows, found, wordList);
  return found;
};

export const addIncomingChars = ({
  direction,
  chars,
  rowWidth,
  rows,
  pos,
}: {
  direction: Direction;
  chars: string;
  rows: string[];
  pos: number;
  rowWidth: number;
}) => {
  const newRows: string[] = [];
  const newRowsNeeded = isVertical(direction) ? chars.length : 1;

  for (let i = 0; i < newRowsNeeded; i++) {
    newRows.push(''.padEnd(rowWidth));
  }

  for (let i = 0; i < chars.length; i++) {
    switch (direction) {
      case Direction.RIGHT:
        newRows[0] = setCharAt(newRows[0], (pos + i) % rowWidth, chars[i]);
        break;
      case Direction.DOWN:
        newRows[i] = setCharAt(newRows[i], pos, chars[i]);
        break;
      case Direction.LEFT:
        newRows[0] = setCharAt(
          newRows[0],
          (pos + i) % rowWidth,
          chars[chars.length - i - 1]
        );
        break;
      case Direction.UP:
        newRows[i] = setCharAt(newRows[i], pos, chars[chars.length - i - 1]);
        break;
    }
  }
  rows.unshift(...newRows);
  return rows;
};

export const createNewIncoming = (
  charCount: number,
  easiness: number
): Incoming => ({
  chars: getRandomLetters(charCount, easiness),
  position: 0,
  direction: Direction.RIGHT,
});

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

export const getNextDirection = (dir: Direction): Direction =>
  ({
    [Direction.RIGHT]: Direction.DOWN,
    [Direction.DOWN]: Direction.LEFT,
    [Direction.LEFT]: Direction.UP,
    [Direction.UP]: Direction.RIGHT,
  }[dir]);
