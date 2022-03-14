import { screened } from '../components/base/Screen';
import HomeScreen from '../screens/HomeScreen';
import { ScreenInfo } from '../utils';

const asScreens = <S extends ScreenInfo>(screens: S[]): S[] =>
  screens.map(
    ({ screen, ...props }) => ({ screen: screened(screen), ...props } as S)
  );

export default asScreens<ScreenInfo>([
  { name: 'Home', screen: HomeScreen },
  // { name: 'Play', screen: PlayScreen },
  // { name: 'About', screen: AboutScreen },
  // { name: 'Help', screen: HelpScreen },
  // { name: 'Feedback', screen: FeedbackScreen },
  // { name: 'Settings', screen: SettingsScreen },
  // { name: 'Stats', screen: StatsScreen },
]);
