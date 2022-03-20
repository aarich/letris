import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type ScreenInfo = {
  name: keyof RootStackParamList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  screen?: any;
  initialParams?: Partial<RootStackParamList[keyof RootStackParamList]>;
  options?: NativeStackNavigationOptions;
};

export type DrawerParamList = {
  HomeScreen: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<DrawerParamList>;
  About: undefined;
  Help: undefined;
  Feedback: undefined;
  Settings: undefined;
  Play: undefined;
  Stats: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RootStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList>
  >;

export type RootStackNavigationProp<Screen extends keyof RootStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList, Screen>,
    DrawerNavigationProp<DrawerParamList>
  >;
