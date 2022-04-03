import { Direction, Game } from './types';

const game: Game = {
  rows: [],
  createdWords: [],
  incoming: { chars: 'AB', direction: Direction.LEFT, position: 3 },
  turn: 3,
  rotations: 0,
  score: 3,
};

export const MOCK_DATA = {
  game,
};
