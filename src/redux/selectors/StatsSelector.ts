import { GameStat } from '../../utils';
import { StatsState } from '../reducers/StatsReducer';
import { useAppSelector } from '../store';

export const useStat = <T extends GameStat>(stat: T): StatsState[T] =>
  useAppSelector((state) => state.stats)[stat];
