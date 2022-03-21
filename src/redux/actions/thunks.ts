import {
  addIncomingChars,
  AppSetting,
  CHAR_DROP_MS,
  createNewIncoming,
  findWords,
  GameStat,
  MatchedWord,
  removeBlankSpaces,
  removeWords,
  toast,
  validateWordSelection,
  WORD_MATCH_MS,
} from '../../utils';
import { AppThunk } from '../store';
import {
  resetGameAction,
  setAnimation,
  setGame,
  setGameStat,
  setRows,
} from './actions';

export const dropCharacters = (): AppThunk => async (dispatch, getState) => {
  const { game, settings } = getState();

  const rows = removeBlankSpaces(game.rows);

  let changesExist = rows.length !== game.rows.length;
  for (let i = 0; i < rows.length; i++) {
    if (changesExist) {
      break;
    }

    // arrays are the same length
    changesExist = rows[i] !== game.rows[i];
  }

  if (changesExist) {
    // animate all missing characters
    await new Promise<void>((resolve) => {
      dispatch(setAnimation({ isDroppingChars: true }));
      setTimeout(() => {
        dispatch(setAnimation({ isDroppingChars: false }));
        resolve();
      }, CHAR_DROP_MS);
    });

    // Animation completed, update the state
    dispatch(setRows(rows));
  }

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

    const { game, settings, stats } = getState();
    const minWordLength = settings[AppSetting.MIN_WORD_LETTER_COUNT] || 3;
    let longestWord = stats[GameStat.LONGEST_WORD];
    const foundWords = stats[GameStat.WORDS_FOUND] ?? 0;

    // Validate words
    if (isManual) {
      validateWordSelection(words, minWordLength);
      // success
      toast(words[0].word, 'success', 1000);
    }

    // Show them on the screen
    await new Promise<void>((resolve) => {
      dispatch(setAnimation({ matchedWords: words }));
      setTimeout(() => {
        dispatch(setAnimation({ matchedWords: undefined }));
        resolve();
      }, WORD_MATCH_MS);
    });

    const newWords = words.map((match) => match.word);
    const createdWords = [...game.createdWords, ...newWords];

    longestWord = newWords.reduce(
      (prev, word) => (word.length > prev.length ? word : prev),
      longestWord || ''
    );

    dispatch(
      setGameStat({
        [GameStat.LONGEST_WORD]: longestWord,
        [GameStat.WORDS_FOUND]: foundWords + newWords.length,
      })
    );

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
  const { settings, game, stats } = getState();

  // Calculate new game state by adding the characters to the top of the grid
  const rowWidth = settings[AppSetting.ROW_WIDTH];

  const {
    rotations,
    incoming: { direction, chars, position },
  } = game;

  const rows = [...game.rows];
  const pos = (rowWidth + position - rotations) % rowWidth;

  // This modifies `rows`
  addIncomingChars({ direction, chars, rows, pos, rowWidth });

  // Get new incoming chars
  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];
  const incoming = createNewIncoming(newCharCount, letterEasiness);

  // Increment turn
  const turn = game.turn + 1;
  if ((stats.HIGH_TURNS ?? 0) < turn) {
    dispatch(setGameStat({ [GameStat.HIGH_TURNS]: turn }));
  }

  dispatch(setGame({ ...game, rows, incoming, turn }));

  // drop characters
  return dispatch(dropCharacters());
};

export const resetGame = (): AppThunk => (dispatch, getState) => {
  const { settings } = getState();
  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];
  const incoming = createNewIncoming(newCharCount, letterEasiness);

  dispatch(resetGameAction(incoming));
  return Promise.resolve();
};
