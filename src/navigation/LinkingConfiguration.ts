import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { DrawerParamList } from '../utils';

type Options = LinkingOptions<DrawerParamList>;

const config: Options['config'] = {
  initialRouteName: 'RootStack',
  screens: {
    RootStack: {
      initialRouteName: 'Home',
      screens: {
        Home: '/home',
        Help: '/help',
        About: '/about',
        Feedback: '/feedback',
        Settings: '/settings',
      },
    },
  },
};

const LinkingConfiguration: Options = {
  prefixes: [Linking.createURL('/')],
  config,
};

export default LinkingConfiguration;
