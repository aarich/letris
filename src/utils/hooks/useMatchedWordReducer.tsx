import { vec } from '@shopify/react-native-skia';
import { Dispatch, Reducer, useReducer } from 'react';
import { isNextTo } from '../grid';
import { GameRow, MatchedWord } from '../types';

type WordReducer = Reducer<
  MatchedWord | undefined,
  | { row: number; col: number; rows: GameRow[]; allowDiagonal: boolean }
  | undefined
>;

const matchedWordReducer: WordReducer = (s, a) => {
  if (!a || !a.rows.length) {
    return undefined;
  }
  const { row, col, rows, allowDiagonal } = a;
  const existingCharIndex = s?.chars.findIndex(
    (c) => c.x === col && c.y === row
  );

  if (typeof existingCharIndex === 'number' && s && existingCharIndex >= 0) {
    // we already have it, remove everything after it
    return {
      word: s.word.slice(0, existingCharIndex + 1),
      chars: s.chars.slice(0, existingCharIndex + 1),
    };
  } else {
    // we are adding a new character
    const charAtPos = rows[row]?.[col];
    if (charAtPos && charAtPos !== ' ') {
      // we selected a character
      const newPos = vec(col, row);
      const ret = { ...(s || { word: '', chars: [] }) };
      if (
        ret.chars.length &&
        !isNextTo(
          ret.chars[ret.chars.length - 1],
          newPos,
          rows[0].length,
          allowDiagonal
        )
      ) {
        // We need to start a new word
        ret.chars = [];
        ret.word = '';
      }

      // check if we need to start over or
      ret.word += charAtPos;
      ret.chars = [...ret.chars, vec(col, row)];
      return ret;
    }
  }

  return s;
};

export const useMatchedWordReducer = (): [
  MatchedWord | undefined,
  Dispatch<
    | { row: number; col: number; rows: GameRow[]; allowDiagonal: boolean }
    | undefined
  >,
] => {
  return useReducer(matchedWordReducer, undefined);
};
