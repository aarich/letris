import { NavigatorScreenParams } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
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

export type RootStackScreenProps<S extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, S>;

export type RootStackNavigationProp<S extends keyof RootStackParamList> =
  RootStackScreenProps<S>['navigation'];
