import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  Divider,
  TopNavigation as UIKTopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { Fragment, ReactNode } from 'react';
import { Icon, Text, View } from '../components/base';
import { Icons } from '../utils';

export default <T extends NativeStackHeaderProps | DrawerHeaderProps>(
    topInsets: number
  ) =>
  ({ options, navigation, route, ...others }: T) => {
    if (options.headerShown === false) {
      return undefined;
    }

    let BackAction = () => (
      <TopNavigationAction
        icon={(props) => <Icon {...props} name={Icons.menu} />}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    );

    let canGoBack = false;

    if ('pop' in navigation && 'back' in others) {
      const goBack = () => navigation.pop();
      canGoBack = false;

      BackAction = () => (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name={Icons.arrowBack} />}
          onPress={goBack}
        />
      );
    }

    const { title, headerRight } = options || {};

    const renderRightActions = () => {
      const headerActions: ReactNode[] = [];

      if (headerRight) {
        headerActions.push(
          <Fragment key="action">{headerRight({ canGoBack })}</Fragment>
        );
      }

      return <View row>{headerActions}</View>;
    };

    return (
      <>
        <UIKTopNavigation
          style={{ paddingTop: topInsets }}
          title={(props) => (
            <Text {...props} style={[props?.style, { marginTop: topInsets }]}>
              {title || route.name}
            </Text>
          )}
          alignment="center"
          accessoryLeft={BackAction}
          accessoryRight={renderRightActions}
        />
        <Divider />
      </>
    );
  };
