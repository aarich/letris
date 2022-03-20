import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../utils';
import { useIsDark } from '../utils/hooks';
import LinkingConfiguration from './LinkingConfiguration';
import screens from './screens';
import TopNavigation from './TopNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  const isDark = useIsDark();
  const topInsets = useSafeAreaInsets().top;

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={isDark ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator
        screenOptions={{
          header: TopNavigation(topInsets),
        }}
        initialRouteName="Home"
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
    </NavigationContainer>
  );
};
