import { useCallback, useEffect, useState } from 'react';
import ActiveBoard from '../../components/play/ActiveBoard';
import {
  advanceGame,
  handleSelectedWords,
  newGame,
  rotateRows,
} from '../../redux/actions';
import { useAnimationState, useGame, useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import {
  alert,
  AppSetting,
  CharDesinations,
  findDests,
  toast,
} from '../../utils';
import { useMatchedWordReducer } from '../../utils/hooks';

const WORD_MATCHER_DELAY_MS = 1700;

type Props = {
  onGoHome: VoidFunction;
  onGoToStats: VoidFunction;
  matchedWord: ReturnType<typeof useMatchedWordReducer>[0];
  selectChar: ReturnType<typeof useMatchedWordReducer>[1];
};

const ActiveBoardContainer = ({
  matchedWord,
  selectChar,
  onGoHome,
  onGoToStats,
}: Props) => {
  const game = useGame();
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const allowDiagonal = useSetting(AppSetting.ALLOW_DIAGONAL);
  const { isDroppingChars } = useAnimationState();
  const dispatch = useAppDispatch();
  const [isPanning, setIsPanning] = useState(false);
  const [animationDestinations, setAnimationDestinations] =
    useState<CharDesinations>();

  useEffect(() => {
    if (matchedWord && !isPanning) {
      // set a timeout to handle validatioon
      const timeout = setTimeout(() => {
        selectChar(undefined);
        dispatch(handleSelectedWords([matchedWord], true)).catch((e) =>
          toast(e.message, 'danger')
        );
      }, WORD_MATCHER_DELAY_MS);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, isPanning, matchedWord, selectChar]);

  useEffect(() => {
    if (isDroppingChars) {
      setAnimationDestinations(findDests(game.rows));
    } else {
      setAnimationDestinations(undefined);
    }
  }, [game.rows, isDroppingChars]);

  const onTap = useCallback(
    (row: number, col: number) => {
      const rotatedCol = (rowWidth + col - game.rotations) % rowWidth;
      selectChar({ col: rotatedCol, row, rows: game.rows, allowDiagonal });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onFling = useCallback(
    (down: boolean) => down && dispatch(advanceGame()),
    [dispatch]
  );

  const onGameOver = useCallback(() => {
    const reset = (fn?: VoidFunction) => () => {
      dispatch(newGame());
      fn?.();
    };
    alert(
      'Game Over',
      `Final Score: ${game.score}\nWords Found: ${game.createdWords.length}`,
      [
        { text: 'New Game', onPress: reset() },
        { text: 'View Stats', onPress: reset(onGoToStats) },
        { text: 'Return Home', onPress: reset(onGoHome), style: 'cancel' },
      ]
    );
  }, [dispatch, game.createdWords.length, game.score, onGoHome, onGoToStats]);

  return (
    <ActiveBoard
      onFlingHorizontal={matchedWord ? undefined : onRotate}
      onFlingVertical={matchedWord ? undefined : onFling}
      onPan={matchedWord ? onPan : undefined}
      onTap={onTap}
      onPanEnd={onPanEnd}
      matchedWord={matchedWord}
      charDestinations={animationDestinations}
      onGameOver={onGameOver}
    />
  );
};

export default ActiveBoardContainer;
