import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../../redux/selectors';
import { IconsOutlined, toast } from '../../utils';
import { Button, Layout, Text, View } from '../base';

type Props = {
  currentWord: string | undefined;
  onTap: VoidFunction | undefined;
  onShift: ((left: boolean) => void) | undefined;
  onFlingDown: VoidFunction | undefined;
  onGoBack: VoidFunction;
  onPressHelp: VoidFunction;
  onPressSettings: VoidFunction;
};

const fling = (d: Directions, action: VoidFunction) =>
  Gesture.Fling().direction(d).onStart(action).runOnJS(true);

const Status = ({
  currentWord,
  onFlingDown,
  onShift,
  onTap,
  onGoBack,
  onPressHelp,
  onPressSettings,
}: Props) => {
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

  const { score } = useGame();

  return (
    <View row center flex>
      <Layout l2 style={[styles.layout, { paddingBottom }]}>
        <View row spread flex>
          <View center>
            <Button
              icon={{ name: IconsOutlined.arrowheadLeft }}
              ghost
              status="basic"
              onPress={onGoBack}
            />
            <Button
              icon={{ name: IconsOutlined.settings }}
              ghost
              status="basic"
              onPress={onPressSettings}
            />
          </View>

          <GestureDetector gesture={gesture}>
            <View center flex>
              <View flex center>
                <Text category="h4" center>
                  {currentWord}
                </Text>
              </View>
            </View>
          </GestureDetector>

          <View center>
            <Button
              ghost
              status="success"
              label={`${score}`}
              size="giant"
              onPress={() => toast(`Score: ${score}`)}
            />
            <Button
              icon={{ name: IconsOutlined.questionMarkCircle }}
              ghost
              status="basic"
              onPress={onPressHelp}
            />
          </View>
        </View>
      </Layout>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  layout: { flex: 1, justifyContent: 'space-between' },
});
