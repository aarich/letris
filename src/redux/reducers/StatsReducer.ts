import { AnyAction } from 'redux';
import { GameStat } from '../../utils';
import { setAppSetting } from '../actions';

export type StatsState = {
  [GameStat.GAMES_PLAYED]: number;
  [GameStat.HIGH_SCORE]: number;
  [GameStat.HIGH_TURNS]: number;
};

const initialState: StatsState = {
  [GameStat.GAMES_PLAYED]: 0,
  [GameStat.HIGH_SCORE]: 0,
  [GameStat.HIGH_TURNS]: 0,
};

const StatsReducer = (state = initialState, action: AnyAction): StatsState => {
  if (setAppSetting.match(action)) {
    return { ...state, ...action.payload };
  }
  return state;
};

export default StatsReducer;
