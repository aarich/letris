import { produce } from 'immer';
import { AnyAction } from 'redux';
import { Direction, Game } from '../../utils';
import {
  newGame,
  reset,
  resetGameAction,
  rotateRows,
  setGame,
  setIncoming,
  setIncomingChars,
  setRows,
} from '../actions';

type GameState = Game;

const initialState: GameState = {
  rows: [],
  turn: 0,
  rotations: 0,
  createdWords: [],
  incoming: { chars: '', direction: Direction.RIGHT, position: 0 },
  score: 0,
};

const GameReducer = (state = initialState, action: AnyAction): GameState =>
  produce(state, (draft) => {
    if (setRows.match(action)) {
      draft.rows = action.payload;
    } else if (setIncoming.match(action)) {
      draft.incoming = action.payload;
    } else if (setIncomingChars.match(action)) {
      draft.incoming.chars = action.payload;
    } else if (setGame.match(action)) {
      return action.payload;
    } else if (rotateRows.match(action)) {
      if (draft.rows.length === 0) {
        return;
      }
      const rotation = action.payload ? -1 : 1;
      const { length } = draft.rows[0];
      // keep rotations a number in [0, rowLength)
      draft.rotations = (draft.rotations + rotation + length) % length;
    } else if (resetGameAction.match(action)) {
      return { ...initialState, incoming: action.payload };
    } else if (reset.match(action) || newGame.match(action)) {
      return initialState;
    }
  });

export default GameReducer;
