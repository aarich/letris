import { Vector } from '@shopify/react-native-skia';

export type GameRow = string;

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type MinLength = 3 | 4 | 5;
export type NewCharCount = 2 | 3 | 4;
export enum LetterEasiness {
  Easy = 0,
  Medium = 0.5,
  Hard = 1,
}

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
  score: number;
};

export type MatchedWord = {
  word: string;
  chars: Vector[];
};

export const isVertical = (dir: Direction) =>
  [Direction.DOWN, Direction.UP].includes(dir);
