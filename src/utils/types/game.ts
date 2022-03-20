import { Vector } from '@shopify/react-native-skia';

export type GameRow = string;

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type MinLength = 3 | 4 | 5;

export type Incoming = {
  chars: string;
  direction: Direction;
  position: number;
};

export type Game = {
  rows: GameRow[];
  createdWords: string[];
  incoming: Incoming;
  turn: number;
  rotations: number;
};

export type MatchedWord = {
  word: string;
  chars: Vector[];
};

export const isVertical = (dir: Direction) =>
  [Direction.DOWN, Direction.UP].includes(dir);
