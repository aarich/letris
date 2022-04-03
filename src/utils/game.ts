import { vec, Vector } from '@shopify/react-native-skia';
import { transpose } from './arrays';
import { getLetterScore, getWordList } from './language';
import { setCharAt } from './string';
import { Direction, isVertical, MatchedWord, MinLength } from './types';

export const CHAR_DROP_MS = 600;
export const WORD_MATCH_MS = 400;
export const CHAR_ROTATE_MS = 100;

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

export const getNextDirection = (dir: Direction): Direction =>
  ({
    [Direction.RIGHT]: Direction.DOWN,
    [Direction.DOWN]: Direction.LEFT,
    [Direction.LEFT]: Direction.UP,
    [Direction.UP]: Direction.RIGHT,
  }[dir]);

export const getWordScore = (word: string): number => {
  return word.split('').reduce((o, c) => o + getLetterScore(c), 0);
};
