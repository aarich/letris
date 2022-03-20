import { useCallback, useMemo } from 'react';
import { advanceGame, setIncoming } from '../../redux/actions';
import {
  useAnimationState,
  useIncoming,
  useSetting,
} from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import {
  addIncomingCharsToTopOfGrid,
  AppSetting,
  FONT_SIZE,
} from '../../utils';
import { View } from '../base';
import Grid from '../render/Grid';

type Props = {};

const IncomingChars = () => {
  const dispatch = useAppDispatch();
  const incoming = useIncoming();
  const { chars, position, direction } = incoming;
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const hideChars = useAnimationState().isDroppingChars;

  const rows = useMemo(
    () =>
      hideChars
        ? [''.padEnd(rowWidth), ''.padEnd(rowWidth)]
        : addIncomingCharsToTopOfGrid({
            direction,
            chars,
            rowWidth,
            rows: [],
            pos: 0,
          }),
    [chars, direction, hideChars, rowWidth]
  );

  const onShift = useCallback(
    (left) => {
      const newPosition = position + (left ? -1 : 1);
      dispatch(
        setIncoming({
          ...incoming,
          position: (rowWidth + newPosition) % rowWidth,
        })
      );
    },
    [dispatch, incoming, position, rowWidth]
  );

  const onAddChars = useCallback(() => dispatch(advanceGame()), [dispatch]);

  return (
    <View row center>
      <Grid
        onFlingVertical={(down) => down && onAddChars()}
        onFlingHorizontal={onShift}
        rotation={position}
        rows={rows}
        height={FONT_SIZE * 2.1}
      />
    </View>
  );
};

export default IncomingChars;
