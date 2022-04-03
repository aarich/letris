import { useEffect } from 'react';
import { useAnimationState, useGame, useSetting } from '../../redux/selectors';
import { AppSetting, CharDesinations, MatchedWord } from '../../utils';
import { useFontSize } from '../../utils/hooks';
import { View } from '../base';
import Grid from '../render/Grid';

type Props = {
  matchedWord: MatchedWord | undefined;
  charDestinations: CharDesinations | undefined;
  onGameOver: VoidFunction;
  onFlingHorizontal: ((left: boolean) => void) | undefined;
  onFlingVertical: ((down: boolean) => void) | undefined;
  onTap: ((row: number, col: number) => void) | undefined;
  onPan: ((row: number, col: number) => void) | undefined;
  onPanEnd: VoidFunction | undefined;
};

const ActiveBoard = ({
  matchedWord,
  charDestinations,
  onGameOver,
  onFlingHorizontal,
  onFlingVertical,
  onPan,
  onTap,
  onPanEnd,
}: Props) => {
  const { rotations, rows } = useGame();
  const { isDroppingIncoming } = useAnimationState();
  const showGridLines = useSetting(AppSetting.VERTICAL_GRID_LINES);
  const maxRows = useSetting(AppSetting.NUM_ROWS);
  const charHeight = useFontSize();
  const height = charHeight * maxRows;

  useEffect(() => {
    if (rows.length > maxRows && !isDroppingIncoming) {
      onGameOver();
    }
  }, [isDroppingIncoming, maxRows, onGameOver, rows.length]);
  return (
    <View row center style={{ height }}>
      <Grid
        rotation={rotations}
        rows={rows}
        onFlingHorizontal={onFlingHorizontal}
        onFlingVertical={onFlingVertical}
        onPan={onPan}
        onTap={onTap}
        onPanEnd={onPanEnd}
        matchedWord={matchedWord}
        charDestinations={charDestinations}
        showGridLines={showGridLines}
        height={height}
      />
    </View>
  );
};

export default ActiveBoard;
