import { StyleSheet } from 'react-native';
import { useGame, useSetting } from '../../redux/selectors';
import {
  AppSetting,
  CharDesinations,
  MatchedWord,
  Spacings,
} from '../../utils';
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
  const showGridLines = useSetting(AppSetting.VERTICAL_GRID_LINES);

  return (
    <View row center flex style={styles.container}>
      <Grid
        rotation={rotations}
        rows={rows}
        onFlingHorizontal={onFlingHorizontal}
        onFlingVertical={onFlingVertical}
        onPan={onPan}
        onTap={onTap}
        onPanEnd={onPanEnd}
        onMaxRowsReached={onGameOver}
        matchedWord={matchedWord}
        charDestinations={charDestinations}
        showGridLines={showGridLines}
      />
    </View>
  );
};

export default ActiveBoard;

const styles = StyleSheet.create({ container: { paddingTop: Spacings.s2 } });
