import {
  addIncomingCharsToTopOfGrid,
  AppSetting,
  CHAR_DROP_MS,
  createNewIncoming,
  findWords,
  MatchedWord,
  removeBlankSpaces,
  validateWordSelection,
} from '../../utils';
import { removeWords, WORD_MATCH_MS } from '../../utils/game';
import { AppThunk } from '../store';
import { setAnimation, setGame, setRows } from './actions';

export const dropCharacters = (): AppThunk => async (dispatch, getState) => {
  // animate all missing characters
  await new Promise<void>((resolve) => {
    dispatch(setAnimation({ isDroppingChars: true }));
    setTimeout(() => {
      dispatch(setAnimation({ isDroppingChars: false }));
      resolve();
    }, CHAR_DROP_MS);
  });

  // Animation completed, update the state
  const { game, settings } = getState();

  const rows = removeBlankSpaces(game.rows);
  dispatch(setRows(rows));

  if (settings[AppSetting.AUTOMATIC_WORD_FIND]) {
    dispatch(autoFindValidWords());
  }
  return Promise.resolve();
};

export const handleSelectedWords =
  (words: MatchedWord[], isManual: boolean): AppThunk =>
  async (dispatch, getState) => {
    if (!words.length) {
      return Promise.resolve();
    }

    const { game, settings } = getState();
    const minWordLength = settings[AppSetting.MIN_WORD_LETTER_COUNT] || 3;

    // Validate words
    if (isManual) {
      validateWordSelection(words, minWordLength);
    }

    // Show them on the screen
    await new Promise<void>((resolve) => {
      dispatch(setAnimation({ matchedWords: words }));
      setTimeout(() => {
        dispatch(setAnimation({ matchedWords: undefined }));
        resolve();
      }, WORD_MATCH_MS);
    });

    const createdWords = [
      ...game.createdWords,
      ...words.map((match) => match.word),
    ];

    // Update the state
    const rows = removeWords(words, game.rows);
    dispatch(setGame({ ...game, createdWords, rows }));

    // drop characters
    return dispatch(dropCharacters());
  };

export const autoFindValidWords = (): AppThunk => (dispatch, getState) => {
  const { game, settings } = getState();

  const rows = [...game.rows];
  const minLength = settings[AppSetting.MIN_WORD_LETTER_COUNT];

  // 1. Find valid words
  const newWords = findWords(rows, game.rotations, minLength);
  dispatch(handleSelectedWords(newWords, false));

  // 4. Drop characters
  return Promise.resolve();
};

/**
 * Adds the incoming characters to the board
 */
export const advanceGame = (): AppThunk => async (dispatch, getState) => {
  const { settings, game } = getState();

  // Calculate new game state by adding the characters to the top of the grid
  const rowWidth = settings[AppSetting.ROW_WIDTH];

  const {
    rotations,
    incoming: { direction, chars, position },
  } = game;

  const rows = [...game.rows];
  const pos = (rowWidth + position - rotations) % rowWidth;

  // This modifies `rows`
  addIncomingCharsToTopOfGrid({ direction, chars, rows, pos, rowWidth });

  // Get new incoming chars
  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];
  const incoming = createNewIncoming(newCharCount, letterEasiness);

  // Increment turn
  const turn = game.turn + 1;

  dispatch(setGame({ ...game, rows, incoming, turn }));

  // drop characters
  return dispatch(dropCharacters());
};
