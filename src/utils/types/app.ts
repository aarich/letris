import { Dispatch, SetStateAction } from 'react';
import { AlertButton } from 'react-native';
import { IconType } from '../icons';

export type ValueOf<T> = T[keyof T];

export enum AppSetting {
  HAS_REQUESTED_REVIEW = 'HAS_REQUESTED_REVIEW',
  ROW_WIDTH = 'ROW_WIDTH',
  NEW_CHAR_COUNT = 'NEW_CHAR_COUNT',
  LETTER_EASINESS = 'LETTER_EASINESS',
  MIN_WORD_LETTER_COUNT = 'MIN_WORD_LETTER_COUNT',
  AUTOMATIC_WORD_FIND = 'AUTOMATIC_WORD_FIND',
  SHOW_GUTTERS = 'SHOW_GUTTERS',
  ALLOW_DIAGONAL = 'ALLOW_DIAGONAL',
}

export enum GameStat {
  GAMES_PLAYED = 'GAMES_PLAYED',
  HIGH_SCORE = 'HIGH_SCORE',
  HIGH_TURNS = 'HIGH_TURNS',
  AVERAGE_TURNS = 'AVERAGE_TURNS',
  LONGEST_WORD = 'LONGEST_WORD',
  WORDS_FOUND = 'WORDS_FOUND',
}

export type MyAlertButton = AlertButton & { icon?: IconType };

export type UpdateState<T> = Dispatch<SetStateAction<T>>;

export const FYI_SETTINGS: AppSetting[] = [];
