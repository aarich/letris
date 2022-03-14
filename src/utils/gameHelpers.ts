import words10 from 'wordlist-english/english-words-10.json';
import words20 from 'wordlist-english/english-words-20.json';
import words35 from 'wordlist-english/english-words-35.json';
import words40 from 'wordlist-english/english-words-40.json';
import words50 from 'wordlist-english/english-words-50.json';
import words55 from 'wordlist-english/english-words-55.json';
import words60 from 'wordlist-english/english-words-60.json';
import { GameState } from '../redux/reducers/GameReducer';
import { Direction } from './types';

const WORDS = [
  ...words10,
  ...words20,
  ...words35,
  ...words40,
  ...words50,
  ...words55,
  ...words60,
].filter((w) => w.length > 3);

export const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

// Moves letters down into new vacant spaces
const dropLetters = (rows: string[]) => {
  for (let i = rows.length - 1; i > 0; i--) {
    for (let c = 0; c < rows[i].length; c++) {
      // If this row has a space and the one above it does not...
      if (rows[i][c] === ' ' && rows[i - 1][c] !== ' ') {
        rows[i] = rows[i].slice(0, c) + rows[i - 1][c] + rows[i].slice(c + 1);
        rows[i - 1] = rows[i - 1].slice(0, c) + ' ' + rows[i - 1].slice(c + 1);
      }
    }
  }
};

/** modifies the rows by removing the words matched. Returns a list of words made */
export const findWords = (rows: string[]): string[] => {
  // Check horizontal
  const foundWords: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].toLowerCase();
    for (const word of WORDS) {
      const index = row.indexOf(word);
      if (index >= 0) {
        // word found
        foundWords.push(word);
        let newRow = row;
        for (let j = 0; j < word.length; j++) {
          newRow = setCharAt(newRow, j + index, ' ');
        }
        rows[i] = newRow.toUpperCase();
        dropLetters(rows);
        return [...foundWords, ...findWords(rows)];
      }
    }
  }
  return foundWords;
};

export const renderGame = (game: GameState) => {
  let ret = '|';

  for (let i = 0; i < game.incoming.position; i++) {
    ret += ' ';
  }

  switch (game.incoming.direction) {
    case Direction.RIGHT:
      ret += game.incoming;
      break;
    case Direction.DOWN:
      ret += game.incoming.chars[0] + '\n' + ret + game.incoming.chars[1];
      break;
    case Direction.LEFT:
      ret += game.incoming.chars[1] + game.incoming.chars[0];
      break;
    case Direction.UP:
      ret += game.incoming.chars[1] + '\n' + ret + game.incoming.chars[0];
      break;
  }

  ret += '\n\n';

  game.rows.forEach((row) => {
    ret += '|' + row + '|\n';
  });

  return ret;
};
