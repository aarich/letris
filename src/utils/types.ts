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
import { Dispatch, SetStateAction } from 'react';
import { AlertButton } from 'react-native';
import { IconType } from './icons';

export type ValueOf<T> = T[keyof T];

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

export enum AppSetting {
  HAS_REQUESTED_REVIEW = 'HAS_REQUESTED_REVIEW',
  ROW_WIDTH = 'ROW_WIDTH',
  NEW_CHAR_COUNT = 'NEW_CHAR_COUNT',
  LETTER_EASINESS = 'LETTER_EASINESS',
}

export enum GameStat {
  GAMES_PLAYED = 'GAMES_PLAYED',
  HIGH_SCORE = 'HIGH_SCORE',
  HIGH_TURNS = 'HIGH_TURNS',
}

export type MyAlertButton = AlertButton & { icon?: IconType };

export type UpdateState<T> = Dispatch<SetStateAction<T>>;

export type GameRow = string;

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
