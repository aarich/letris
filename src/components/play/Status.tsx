import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame, useSetting } from '../../redux/selectors';
import { AppSetting, IconsOutlined } from '../../utils';
import { Button, Layout, Text, View } from '../base';

type Props = {
  currentWord: string | undefined;
  onTap: VoidFunction | undefined;
  onShift: ((left: boolean) => void) | undefined;
  onFlingDown: VoidFunction | undefined;
};

const fling = (d: Directions, action: VoidFunction) =>
  Gesture.Fling().direction(d).onStart(action).runOnJS(true);

const Status = ({ currentWord, onFlingDown, onShift, onTap }: Props) => {
  const paddingBottom = useSafeAreaInsets().bottom;

  const gesture = useMemo(() => {
    return Gesture.Exclusive(
      ...[
        fling(Directions.RIGHT, () => onShift?.(false)),
        fling(Directions.LEFT, () => onShift?.(true)),
        fling(Directions.DOWN, () => onFlingDown?.()),
        Gesture.Tap()
          .onStart(() => onTap?.())
          .runOnJS(true),
      ]
    );
  }, [onFlingDown, onShift, onTap]);

  const height = useSetting(AppSetting.FONT_SIZE) * 2;

  const { score } = useGame();

  return (
    <View row center>
      <Layout l2 style={[styles.layout, { paddingBottom }]}>
        <View row spread style={{ height }}>
          <Button
            icon={{ name: IconsOutlined.arrowheadLeft }}
            ghost
            status="basic"
          />
          <GestureDetector gesture={gesture}>
            <View center flex>
              <Text category="h4" center>
                {currentWord}
              </Text>
            </View>
          </GestureDetector>
          <Button ghost status="success" label={`${score}`} />
        </View>
      </Layout>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  layout: { flex: 1, justifyContent: 'space-between' },
});
