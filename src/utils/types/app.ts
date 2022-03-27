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
  VERTICAL_GRID_LINES = 'VERTICAL_GRID_LINES',
  ANIMATIONS_ENABLED = 'ANIMATIONS_ENABLED',
  FONT_SIZE = 'FONT_SIZE',
  SKIA_ENABLED = 'SKIA_ENABLED',
}

export enum GameStat {
  HIGH_SCORE = 'HIGH_SCORE',
  HIGH_TURNS = 'HIGH_TURNS',
  LONGEST_WORD = 'LONGEST_WORD',
  HIGHEST_SCORING_WORD = 'HIGHEST_SCORING_WORD',
  TOTAL_WORDS = 'TOTAL_WORDS',
  TOTAL_TURNS = 'TOTAL_TURNS',
  TOTAL_SCORE = 'TOTAL_SCORE',
  TOTAL_GAMES = 'TOTAL_GAMES',
}

export type MyAlertButton = AlertButton & { icon?: IconType };

export type UpdateState<T> = Dispatch<SetStateAction<T>>;

export const FYI_SETTINGS: AppSetting[] = [];

export type CharDesinations = (number | undefined)[][];
