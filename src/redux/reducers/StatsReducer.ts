import { produce } from 'immer';
import { AnyAction } from 'redux';
import { GameStat } from '../../utils';
import { newGame, reset, setGameStat } from '../actions';

export type StatsState = {
  [GameStat.TOTAL_GAMES]?: number;
  [GameStat.HIGH_SCORE]?: number;
  [GameStat.HIGH_TURNS]?: number;
  [GameStat.TOTAL_TURNS]?: number;
  [GameStat.TOTAL_SCORE]?: number;
  [GameStat.TOTAL_WORDS]?: number;
  [GameStat.LONGEST_WORD]?: string;
  [GameStat.HIGHEST_SCORING_WORD]?: string;
};

const initialState: StatsState = {};

const StatsReducer = (state = initialState, action: AnyAction): StatsState =>
  produce(state, (draft) => {
    if (setGameStat.match(action)) {
      return { ...draft, ...action.payload };
    } else if (newGame.match(action)) {
      draft[GameStat.TOTAL_GAMES] = (draft[GameStat.TOTAL_GAMES] ?? 0) + 1;
    } else if (reset.match(action)) {
      return initialState;
    }
  });

export default StatsReducer;
