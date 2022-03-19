import { AppSetting, Direction, findWords, log, setCharAt } from '../../utils';
import { getRandomLetter } from '../../utils/language';
import { AppThunk } from '../store';
import { setGame } from './actions';

/** Modifies rows in place by dropping char at pos at the first blank spot */
const addCharAtPos = (
  rows: string[],
  char: string,
  pos: number,
  rowWidth: number
) => {
  if (pos >= rowWidth) {
    log('Cannot set char at position!', { pos, rowWidth, rows, char });
    throw new Error('Developer error, please try again later.');
  }

  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][pos] === ' ') {
      rows[i] = setCharAt(rows[i], pos, char);
      return;
    }
  }

  // Need to add a new row
  let newRow = '';
  for (let i = 0; i < rowWidth; i++) {
    newRow += ' ';
  }

  rows.unshift(newRow);
  addCharAtPos(rows, char, pos, rowWidth);
};

const getNextIncoming = (newCharCount: number, easiness: number) => {
  let result = '';
  for (let i = 0; i < newCharCount; i++) {
    result += getRandomLetter(easiness);
  }
  return result;
};

const addIncomingChars = ({
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
  const addChar = (i: number, p: number) =>
    addCharAtPos(rows, chars[i], p, rowWidth);

  for (let i = 0; i < chars.length; i++) {
    switch (direction) {
      case Direction.RIGHT:
        addChar(i, pos + i);
        break;
      case Direction.DOWN:
        addChar(chars.length - i - 1, pos);
        break;
      case Direction.LEFT:
        addChar(chars.length - i - 1, pos + i);
        break;
      case Direction.UP:
        addChar(i, pos);
        break;
    }
  }
};

export const advanceGame = (): AppThunk<void> => (dispatch, getState) => {
  const { settings, game } = getState();

  const rowWidth = settings[AppSetting.ROW_WIDTH];
  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];

  const {
    turn,
    rotations,
    incoming: { direction, chars, position },
  } = game;

  const rows = [...game.rows];
  const pos = (position + rotations) % rowWidth;

  addIncomingChars({ direction, chars, rows, pos, rowWidth });

  const createdWords = [...game.createdWords, ...findWords(rows)];

  dispatch(
    setGame({
      rotations,
      rows,
      incoming: {
        chars: getNextIncoming(newCharCount, letterEasiness),
        position: 0,
        direction: Direction.RIGHT,
      },
      createdWords,
      turn: turn + 1,
    })
  );
  return Promise.resolve();
};
