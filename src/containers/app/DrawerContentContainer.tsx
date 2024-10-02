import {
  DrawerContentComponentProps,
  useDrawerProgress,
} from '@react-navigation/drawer';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerContent } from '../../components/app/DrawerContent';

type Props = DrawerContentComponentProps;

const DrawerContentContainer = (props: Props) => {
  const { navigation } = props;

  const progress = useDrawerProgress();

  const paddingTop = useSafeAreaInsets().top;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-100, 0]),
      },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, styles.drawerContent]}>
      <DrawerContent
        onGoToScreen={(screen) => navigation.navigate(screen)}
        onToggleDrawer={() => navigation.toggleDrawer()}
        style={{ paddingTop }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
});

export default memo(DrawerContentContainer);
