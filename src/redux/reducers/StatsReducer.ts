import { AnyAction } from 'redux';
import { GameStat } from '../../utils';
import { reset, setGameStat } from '../actions';

export type StatsState = {
  [GameStat.GAMES_PLAYED]?: number;
  [GameStat.HIGH_SCORE]?: number;
  [GameStat.HIGH_TURNS]?: number;
  [GameStat.AVERAGE_TURNS]?: number;
  [GameStat.WORDS_FOUND]?: number;
  [GameStat.LONGEST_WORD]?: string;
};

const initialState: StatsState = {
  [GameStat.GAMES_PLAYED]: 0,
  [GameStat.HIGH_SCORE]: 0,
  [GameStat.HIGH_TURNS]: 0,
  [GameStat.AVERAGE_TURNS]: 0,
  [GameStat.WORDS_FOUND]: 0,
  [GameStat.LONGEST_WORD]: '',
};

const StatsReducer = (state = initialState, action: AnyAction): StatsState => {
  if (setGameStat.match(action)) {
    return { ...state, ...action.payload };
  } else if (reset.match(action)) {
    return initialState;
  }
  return state;
};

export default StatsReducer;
