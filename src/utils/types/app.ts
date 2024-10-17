import { Dispatch, SetStateAction } from 'react';
import { AlertButton } from 'react-native';
import { IconType } from '../icons';
import { LetterEasiness, MinLength, NewCharCount } from './game';

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
  NUM_ROWS = 'NUM_ROWS',
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

export enum FontSize {
  Small = 'Small',
  Large = 'Large',
}

export type SettingsState = {
  [AppSetting.HAS_REQUESTED_REVIEW]: boolean;
  [AppSetting.AUTOMATIC_WORD_FIND]: boolean;
  [AppSetting.SHOW_GUTTERS]: boolean;
  [AppSetting.ALLOW_DIAGONAL]: boolean;
  [AppSetting.VERTICAL_GRID_LINES]: boolean;
  [AppSetting.ANIMATIONS_ENABLED]: boolean;
  [AppSetting.NEW_CHAR_COUNT]: NewCharCount;
  [AppSetting.ROW_WIDTH]: number;
  [AppSetting.LETTER_EASINESS]: LetterEasiness;
  [AppSetting.FONT_SIZE]: FontSize;
  [AppSetting.MIN_WORD_LETTER_COUNT]: MinLength;
  [AppSetting.NUM_ROWS]: number;
};
