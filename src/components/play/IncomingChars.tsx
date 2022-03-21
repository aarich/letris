import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { advanceGame, setIncoming } from '../../redux/actions';
import {
  useAnimationState,
  useIncoming,
  useSetting,
} from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import {
  addIncomingChars,
  alert,
  AppSetting,
  FONT_SIZE,
  getNextDirection,
  IconsOutlined,
} from '../../utils';
import { Button, Layout, View } from '../base';
import Grid from '../render/Grid';
type Props = { onGoBack: VoidFunction; onGoToHelp: VoidFunction };

const IncomingChars = ({ onGoBack, onGoToHelp }: Props) => {
  const dispatch = useAppDispatch();
  const incoming = useIncoming();
  const { chars, direction } = incoming;
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const hideChars = useAnimationState().isDroppingChars;

  const rows = useMemo(() => {
    const ret: string[] = [];
    if (!hideChars) {
      ret.push(
        ...addIncomingChars({ direction, chars, rowWidth, rows: [], pos: 0 })
      );
    }
    while (ret.length < newCharCount) {
      ret.unshift(''.padEnd(rowWidth));
    }
    return ret;
  }, [chars, direction, hideChars, newCharCount, rowWidth]);

  const onShift = useCallback(
    (left) => {
      const newPosition = incoming.position + (left ? -1 : 1);
      const position = (rowWidth + newPosition) % rowWidth;
      dispatch(setIncoming({ ...incoming, position }));
    },
    [dispatch, incoming, rowWidth]
  );

  const onAddChars = useCallback(() => dispatch(advanceGame()), [dispatch]);
  const onRotate = useCallback(() => {
    const direction = getNextDirection(incoming.direction);
    dispatch(setIncoming({ ...incoming, direction }));
  }, [dispatch, incoming]);

  const paddingTop = useSafeAreaInsets().top;

  return (
    <View row center>
      <Layout l2 style={[styles.layout, { paddingTop }]}>
        <Button
          icon={{ name: IconsOutlined.arrowheadLeft }}
          ghost
          status="basic"
          onPress={onGoBack}
        />
        <Grid
          onFlingVertical={(down) => down && onAddChars()}
          onFlingHorizontal={onShift}
          onTap={onRotate}
          rotation={incoming.position}
          rows={rows}
          height={FONT_SIZE * 1.05 * newCharCount}
        />
        <Button
          icon={{ name: IconsOutlined.questionMarkCircle }}
          ghost
          status="basic"
          onPress={() =>
            alert(
              'Instructions',
              'Choose a spot to drop the characters into the game below. ' +
                'Tap to rotate, swipe left and right to adjust the drop zone. ' +
                'Swipe down to drop.\n\nTry to make words out of the grid ' +
                'below. Swipe left and right to shift the characters around.\n\n' +
                'To highlight a word, tap a character, then tap or swipe through the remaining characters of the word. ' +
                '',
              [{ text: 'Full Instructions', onPress: onGoToHelp }],
              'Ok'
            )
          }
        />
      </Layout>
    </View>
  );
};

export default IncomingChars;

const styles = StyleSheet.create({
  layout: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
});
