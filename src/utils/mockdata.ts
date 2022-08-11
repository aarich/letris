import { MEDIUM_GAME_SETTINGS } from './settings';
import { AppSetting, Direction, Game } from './types';

const settings = {
  ...MEDIUM_GAME_SETTINGS,
  [AppSetting.SHOW_GUTTERS]: true,
  [AppSetting.VERTICAL_GRID_LINES]: true,
};

const game: Game = {
  rows: ['       ', ' R  AO ', ' AP TT ', ' RHKHE ', 'LSEFFD '],
  createdWords: [],
  incoming: { chars: 'WNI', direction: Direction.LEFT, position: 3 },
  turn: 3,
  rotations: 0,
  score: 153,
};

export const MOCK_DATA = {
  game,
  settings,
};
