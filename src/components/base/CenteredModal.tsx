import { Modal } from '@ui-kitten/components';
import { FC, PropsWithChildren, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useKeyboardSize } from '../../utils/hooks';
import { Card, Text } from './io';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  title?: string;
  visible: boolean;
  onRequestClose: () => void;
  avoidKeyboard?: boolean;
}>;

const CenteredModal: FC<Props> = ({
  visible,
  onRequestClose,
  children,
  title,
  avoidKeyboard,
}) => {
  const keyboardSize = useKeyboardSize();
  const paddingBottom = useSharedValue(0);

  useEffect(() => {
    if (avoidKeyboard) {
      const toValue = keyboardSize * 0.6;
      if (toValue != paddingBottom.value) {
        paddingBottom.value = withTiming(toValue, {
          duration: 200,
          easing: Easing.quad,
        });
      }
    }
  }, [avoidKeyboard, keyboardSize, paddingBottom]);

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: paddingBottom.value,
  }));

  return (
    <Modal
      visible={visible}
      onBackdropPress={onRequestClose}
      backdropStyle={styles.backdrop}
    >
      <Animated.View style={animatedStyle}>
        <Card style={styles.card} padded disabled>
          {title ? (
            <Text category="h5" center>
              {title}
            </Text>
          ) : undefined}
          {children}
        </Card>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  card: { marginHorizontal: 10 },
});

export default CenteredModal;
