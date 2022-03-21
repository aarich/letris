import { GameStat } from '../../utils';
import { StatsState } from '../reducers/StatsReducer';
import { useAppSelector } from '../store';

export const useStats = (): StatsState =>
  useAppSelector((state) => state.stats);

export const useStat = <T extends GameStat>(stat: T): StatsState[T] =>
  useStats()[stat];
