import { Layout as UIKLayout, LayoutProps } from '@ui-kitten/components';
import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  flex?: boolean;
  l2?: boolean;
  l3?: boolean;
  l4?: boolean;
  safe?: boolean;
} & LayoutProps;

const Layout: FC<Props> = ({
  l2,
  l3,
  l4,
  level: propsLevel,
  children,
  flex,
  style,
  safe,
  ...props
}) => {
  let computedStyle: StyleProp<ViewStyle> = style;
  const flexStyle = { flex: 1 };
  if (flex) {
    computedStyle = [computedStyle, flexStyle];
  }
  let level = propsLevel ?? '1';
  if (l2) {
    level = '2';
  } else if (l3) {
    level = '3';
  } else if (l4) {
    level = '4';
  }

  return (
    <UIKLayout style={computedStyle} level={level} {...props}>
      {safe ? (
        <SafeAreaView style={flexStyle}>{children}</SafeAreaView>
      ) : (
        children
      )}
    </UIKLayout>
  );
};

export default Layout;
