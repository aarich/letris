import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../utils';

type Options = LinkingOptions<RootStackParamList>;

const config: Options['config'] = {
  initialRouteName: 'Home',
  screens: {
    Home: {
      initialRouteName: 'HomeScreen',
      screens: {
        HomeScreen: '/home',
      },
    },
  },
};

const LinkingConfiguration: Options = {
  prefixes: [Linking.createURL('/')],
  config,
};

export default LinkingConfiguration;
