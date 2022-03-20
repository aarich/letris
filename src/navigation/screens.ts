import { screened } from '../components/base/Screen';
import FeedbackScreen from '../screens/FeedbackScreen';
import PlayScreen from '../screens/PlayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { ScreenInfo } from '../utils';
import DrawerNavigator from './DrawerNavigator';

const asScreens = <S extends ScreenInfo>(screens: S[]): S[] =>
  screens.map(
    ({ screen, ...props }) => ({ screen: screened(screen), ...props } as S)
  );

export default asScreens<ScreenInfo>([
  { name: 'Home', screen: DrawerNavigator, options: { headerShown: false } },
  { name: 'Play', screen: PlayScreen, options: { headerShown: false } },
  // { name: 'About', screen: AboutScreen },
  // { name: 'Help', screen: HelpScreen },
  { name: 'Feedback', screen: FeedbackScreen },
  { name: 'Settings', screen: SettingsScreen },
  // { name: 'Stats', screen: StatsScreen },
]);
