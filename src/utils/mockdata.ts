import { GameState } from '../redux/reducers/GameReducer';
import { Direction } from './types';

const game: GameState = {
  rows: [],
  createdWords: [],
  incoming: { chars: 'AB', direction: Direction.LEFT, position: 3 },
  turn: 3,
};

export const MOCK_DATA = {
  game,
};
