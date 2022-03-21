import { vec } from '@shopify/react-native-skia';
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import {
  advanceGame,
  handleSelectedWords,
  rotateRows,
} from '../../redux/actions';
import { useGame, useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { AppSetting, GameRow, isNextTo, MatchedWord, toast } from '../../utils';
import { View } from '../base';
import Grid from '../render/Grid';

type WordReducer = Reducer<
  MatchedWord | undefined,
  | { row: number; col: number; rows: GameRow[]; allowDiagonal: boolean }
  | undefined
>;

const WORD_MATCHER_DELAY_MS = 1700;

const MatchedWordReducer: WordReducer = (s, a) => {
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
      ret.chars.push(vec(col, row));
      return ret;
    }
  }

  return s;
};

const ActiveBoard = () => {
  const game = useGame();
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const allowDiagonal = useSetting(AppSetting.ALLOW_DIAGONAL);
  const dispatch = useAppDispatch();
  const [matchedWord, selectChar] = useReducer<WordReducer>(
    MatchedWordReducer,
    undefined
  );
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    if (matchedWord && !isPanning) {
      // set a timeout to handle validatioon
      const timeout = setTimeout(() => {
        dispatch(handleSelectedWords([matchedWord], true))
          .catch((e) => toast(e.message, 'danger'))
          .then(() => selectChar(undefined));
      }, WORD_MATCHER_DELAY_MS);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, isPanning, matchedWord]);

  const onTap = useCallback(
    (row: number, col: number) => {
      const rotatedCol = (rowWidth + col - game.rotations) % rowWidth;
      selectChar({ col: rotatedCol, row, rows: game.rows, allowDiagonal });
    },
    [allowDiagonal, game.rotations, game.rows, rowWidth]
  );

  const onPan = useCallback(
    (row: number, col: number) => {
      setIsPanning(true);
      onTap(row, col);
    },
    [onTap]
  );

  const onPanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const onRotate = useCallback(
    (left: boolean) => dispatch(rotateRows(left)),
    [dispatch]
  );

  return (
    <View row center flex>
      <Grid
        rotation={game.rotations}
        rows={game.rows}
        onFlingHorizontal={matchedWord ? undefined : onRotate}
        onFlingVertical={(down) => down && dispatch(advanceGame())}
        onTap={onTap}
        onPan={matchedWord ? onPan : undefined}
        onPanEnd={onPanEnd}
        matchedWord={matchedWord}
        flex
      />
    </View>
  );
};

export default ActiveBoard;
