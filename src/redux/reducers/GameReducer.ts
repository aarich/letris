import { produce } from 'immer';
import { AnyAction } from 'redux';
import { Direction, GameRow } from '../../utils';
import { reset, setGame, setIncoming, setRows } from '../actions';

export type IncomingState = {
  chars: string;
  direction: Direction;
  position: number;
};

export type GameState = {
  rows: GameRow[];
  createdWords: string[];
  incoming: IncomingState;
  turn: number;
};

const initialState: GameState = {
  rows: [],
  turn: 0,
  createdWords: [],
  incoming: { chars: 'AB', direction: Direction.RIGHT, position: 0 },
};

const GameReducer = (state = initialState, action: AnyAction): GameState =>
  produce(state, (draft) => {
    if (setRows.match(action)) {
      draft.rows = action.payload;
    } else if (setIncoming.match(action)) {
      draft.incoming = action.payload;
    } else if (setGame.match(action)) {
      return action.payload;
    } else if (reset.match(action)) {
      return initialState;
    }
  });

export default GameReducer;
