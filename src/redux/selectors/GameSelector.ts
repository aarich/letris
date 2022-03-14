import { GameRow, MOCK_DATA, MyConstants } from '../../utils';
import { IncomingState } from '../reducers/GameReducer';
import { useAppSelector } from '../store';

export const useGame = () => {
  const game = useAppSelector((state) => state.game);
  if (MyConstants.isScreenshotting) {
    return MOCK_DATA.game;
  }

  return game;
};

export const useIncoming = (): IncomingState => useGame().incoming;
export const useCreatedWords = (): string[] => useGame().createdWords;
export const useRows = (): GameRow[] => useGame().rows;
export const useCurrentTurn = (): number => useGame().turn;
