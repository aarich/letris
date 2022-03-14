import { useLinkTo } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { parse, useURL } from 'expo-linking';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../utils';
import screens from './screens';
import TopNavigation from './TopNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const topInsets = useSafeAreaInsets().top;

  const appUrl = useURL();
  const linkTo = useLinkTo();
  useEffect(() => {
    if (!appUrl) {
      return;
    }

    const { path } = parse(appUrl);
    if (path) {
      linkTo('/' + path);
    }
  }, [appUrl, linkTo]);

  return (
    <Stack.Navigator
      screenOptions={{
        header: TopNavigation(topInsets),
      }}
    >
      {screens.map(({ name, screen, options }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={screen}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
