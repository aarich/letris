import { AppSetting, Direction, findWords, setCharAt } from '../../utils';
import { AppThunk } from '../store';
import { setGame, setRows } from './actions';

const addCharAtPos = (
  rows: string[],
  char: string,
  pos: number,
  rowWidth: number
) => {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][pos] === ' ') {
      rows[i] = setCharAt(rows[i], pos, char);
      return;
    }
  }

  // need to add a new row
  let newRow = '';
  for (let i = 0; i < rowWidth; i++) {
    newRow += ' ';
  }

  rows.unshift(newRow);
  addCharAtPos(rows, char, pos, rowWidth);
};

const getLetter = (easiness: number) => {
  const lookup = {
    a: 8167,
    b: 9659,
    c: 12441,
    d: 16694,
    e: 29396,
    f: 31624,
    g: 33639,
    h: 39733,
    i: 46699,
    j: 46852,
    k: 47624,
    l: 51649,
    m: 54055,
    n: 60804,
    o: 68311,
    p: 70240,
    q: 70335,
    r: 76322,
    s: 82649,
    t: 91705,
    u: 94463,
    v: 95441,
    w: 97801,
    x: 97951,
    y: 99925,
    z: 100000,
  } as const;

  const random = Math.random() * 100000;

  for (const letter in lookup) {
    if (lookup[letter as keyof typeof lookup] > random) {
      return letter.toUpperCase();
    }
  }
};

const getNextIncoming = (newCharCount: number, easiness: number) => {
  let result = '';
  for (let i = 0; i < newCharCount; i++) {
    result += getLetter(easiness);
  }
  return result;
};

export const advanceGame = (): AppThunk<void> => (dispatch, getState) => {
  const { settings, game } = getState();

  const {
    rows: oldrows,
    incoming: { direction: dir, chars: incoming, position: pos },
    createdWords: prevCreatedWords,
    turn,
  } = game;

  const rows = oldrows.map((r) => r);

  const rowWidth = settings[AppSetting.ROW_WIDTH];
  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];

  switch (dir) {
    case Direction.RIGHT:
      addCharAtPos(rows, incoming[0], pos, rowWidth);
      addCharAtPos(rows, incoming[1], pos + 1, rowWidth);
      break;
    case Direction.DOWN:
      addCharAtPos(rows, incoming[1], pos, rowWidth);
      addCharAtPos(rows, incoming[0], pos, rowWidth);
      break;
    case Direction.LEFT:
      addCharAtPos(rows, incoming[1], pos, rowWidth);
      addCharAtPos(rows, incoming[0], pos + 1, rowWidth);
      break;
    case Direction.UP:
      addCharAtPos(rows, incoming[0], pos, rowWidth);
      addCharAtPos(rows, incoming[1], pos, rowWidth);
      break;
  }

  const createdWords = [...prevCreatedWords, ...findWords(rows)];

  dispatch(
    setGame({
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

const rotateL = (s: string) => s.slice(1) + s.slice(0, 1);
const rotateR = (s: string) => s.slice(s.length - 1) + s.slice(0, s.length - 1);

export const rotateRows =
  (left: boolean): AppThunk<void> =>
  (dispatch, getState) => {
    const { rows } = getState().game;
    dispatch(setRows(rows.map(left ? rotateL : rotateR)));
    return Promise.resolve();
  };
