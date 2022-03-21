import AboutScreen from '../screens/AboutScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import HelpScreen from '../screens/HelpScreen';
import PlayScreen from '../screens/PlayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import { ScreenInfo } from '../utils';
import DrawerNavigator from './DrawerNavigator';

export default [
  { name: 'Home', screen: DrawerNavigator, options: { headerShown: false } },
  { name: 'Play', screen: PlayScreen, options: { headerShown: false } },
  { name: 'About', screen: AboutScreen },
  { name: 'Help', screen: HelpScreen },
  { name: 'Feedback', screen: FeedbackScreen },
  { name: 'Settings', screen: SettingsScreen },
  { name: 'Stats', screen: StatsScreen },
] as ScreenInfo[];
