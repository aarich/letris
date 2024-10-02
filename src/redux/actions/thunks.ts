import {
  addIncomingChars,
  AppSetting,
  findWords,
  GameStat,
  getRandomLetters,
  getWordScore,
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

/**
 * @returns the function to call when characters are finished dropping
 */
const dropCharacters = (): AppThunk => async (dispatch, getState) => {
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
    const animate = settings[AppSetting.ANIMATIONS_ENABLED];
    if (animate) {
      dispatch(setAnimation({ isDroppingChars: true }));
      return;
    }
  }

  return dispatch(finishedDroppingChars(changesExist));
};

export const finishedDroppingChars =
  (changesExist = true): AppThunk =>
  (dispatch, getState) => {
    const { game, settings } = getState();

    if (changesExist) {
      const rows = removeBlankSpaces(game.rows);
      dispatch(setRows(rows));
    }

    dispatch(
      setAnimation({ isDroppingChars: false, isDroppingIncoming: false })
    );

    if (settings[AppSetting.AUTOMATIC_WORD_FIND]) {
      return dispatch(autoFindValidWords());
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
    let highScoreWord = stats[GameStat.HIGHEST_SCORING_WORD];
    let highScore = stats[GameStat.HIGH_SCORE];
    const totalWords = stats[GameStat.TOTAL_WORDS] ?? 0;
    const totalScore = stats[GameStat.TOTAL_SCORE] ?? 0;

    // Validate words
    if (isManual) {
      validateWordSelection(words, minWordLength);
      // success toast
      toast(
        `${words[0].word} (+${getWordScore(words[0].word)})`,
        'success',
        1000
      );
    } else {
      // Show them on the screen
      await new Promise<void>((resolve) => {
        dispatch(setAnimation({ matchedWords: words }));
        setTimeout(() => {
          dispatch(setAnimation({ matchedWords: undefined }));
          resolve();
        }, WORD_MATCH_MS);
      });
    }

    const newWords = words.map((match) => match.word);
    const createdWords = [...game.createdWords, ...newWords];
    const newScore = newWords.reduce((s, w) => s + getWordScore(w), 0);

    if (isManual) {
      // only update longest and highest scoring word if manual
      longestWord = newWords.reduce(
        (prev, word) => (word.length > prev.length ? word : prev),
        longestWord || ''
      );
      // if manual, only one word possible
      highScoreWord =
        newScore > getWordScore(highScoreWord ?? '')
          ? newWords[0]
          : highScoreWord;
    }

    const score = (game.score || 0) + newScore;
    highScore = score > (highScore ?? 0) ? score : highScore;

    dispatch(
      setGameStat({
        [GameStat.LONGEST_WORD]: longestWord,
        [GameStat.HIGHEST_SCORING_WORD]: highScoreWord,
        [GameStat.TOTAL_WORDS]: totalWords + newWords.length,
        [GameStat.TOTAL_SCORE]: totalScore + newScore,
        [GameStat.HIGH_SCORE]: highScore,
      })
    );

    // Update the state
    const rows = removeWords(words, game.rows);
    dispatch(setGame({ ...game, createdWords, rows, score }));

    // drop characters
    return dispatch(dropCharacters());
  };

export const autoFindValidWords = (): AppThunk => (dispatch, getState) => {
  const { game, settings } = getState();

  const rows = [...game.rows];
  const minLength = settings[AppSetting.MIN_WORD_LETTER_COUNT];

  // 1. Find valid words
  const newWords = findWords(rows, game.rotations, minLength);
  dispatch(handleSelectedWords(newWords, false)).then(() => {
    newWords.length && dispatch(autoFindValidWords());
  });

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
  const incoming = {
    chars: getRandomLetters(newCharCount, letterEasiness),
    direction,
    position,
  };

  // Increment turn
  const turn = game.turn + 1;
  if ((stats.HIGH_TURNS ?? 0) < turn) {
    dispatch(setGameStat({ [GameStat.HIGH_TURNS]: turn }));
  }
  const totalTurns = stats[GameStat.TOTAL_TURNS] ?? 0;
  dispatch(setGameStat({ [GameStat.TOTAL_TURNS]: totalTurns + 1 }));

  dispatch(setAnimation({ isDroppingIncoming: true }));
  dispatch(setGame({ ...game, rows, incoming, turn }));

  // drop characters
  return dispatch(dropCharacters());
};

export const resetGame = (): AppThunk => (dispatch, getState) => {
  const {
    settings,
    game: { incoming },
  } = getState();

  const letterEasiness = settings[AppSetting.LETTER_EASINESS];
  const newCharCount = settings[AppSetting.NEW_CHAR_COUNT];
  const chars = getRandomLetters(newCharCount, letterEasiness);

  dispatch(resetGameAction({ ...incoming, chars }));
  return Promise.resolve();
};
