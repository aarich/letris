import { AnyAction } from 'redux';
import { GameStat } from '../../utils';
import { setAppSetting } from '../actions';

export type StatsState = {
  [GameStat.GAMES_PLAYED]: number;
};

const initialState: StatsState = {
  [GameStat.GAMES_PLAYED]: 0,
};

const StatsReducer = (state = initialState, action: AnyAction): StatsState => {
  if (setAppSetting.match(action)) {
    return { ...state, ...action.payload };
  }
  return state;
};

export default StatsReducer;
