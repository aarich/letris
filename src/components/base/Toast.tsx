import { EvaStatus } from '@ui-kitten/components/devsupport';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Text } from './io';

type Props = {
  visible: boolean;
  status: EvaStatus;
  message: string;
};
const Toast = ({ visible, status, message }: Props) => {
  const [animating, setAnimating] = useState(false);

  const opacity = useSharedValue(0);

  useEffect(() => {
    const toValue = visible ? 1 : 0;
    if (opacity.value != toValue) {
      setAnimating(true);
      opacity.value = withTiming(toValue, { duration: 300 }, () =>
        runOnJS(setAnimating)(false)
      );
    }
  }, [visible]);

  const bottom = Math.max(useSafeAreaInsets().bottom, 20) + 10;

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return visible || animating ? (
    <View style={[styles.view, { bottom }]}>
      <Animated.View style={animatedStyle}>
        <Card style={styles.card} status={status} padded>
          <Text style={styles.message} center>
            {message}
          </Text>
        </Card>
      </Animated.View>
    </View>
  ) : null;
};

export default Toast;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
    marginHorizontal: 5,
  },
  message: { fontWeight: 'bold' },
  view: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
});
