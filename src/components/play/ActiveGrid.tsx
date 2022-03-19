import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GameRow, Spacings } from '../../utils';
import { Text, View } from '../base';

type Props = {
  rows: GameRow[];
  rotation: number;
  onRotate: (left: boolean) => void;
};

const ActiveGrid = ({ rows, rotation, onRotate }: Props) => {
  const position = useSharedValue(0);

  const rotate = (left: boolean) => {
    'worklet';
    runOnJS(onRotate)(left);
  };

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      position.value = withTiming(position.value + 20, { duration: 200 });
    })
    .onEnd(() => rotate(false));
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(position.value - 20, { duration: 200 });
    })
    .onEnd(() => rotate(true));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));
  return (
    <GestureDetector gesture={Gesture.Exclusive(flingLeft, flingRight)}>
      <Animated.View style={animatedStyle}>
        <View>
          {rows.map((row, i) => (
            <View key={`${i}${row}`} row>
              {row.split('').map((_, j) => {
                const c = row[(j + rotation) % row.length];
                return (
                  <View
                    key={`${c}${j}`}
                    style={{ paddingHorizontal: Spacings.s1 }}
                  >
                    <Text mono center>
                      {c}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ActiveGrid;
