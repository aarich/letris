import { GameRow, Incoming, MOCK_DATA, MyConstants } from '../../utils';
import { useAppSelector } from '../store';

export const useGame = () => {
  const game = useAppSelector((state) => state.game);
  if (MyConstants.isScreenshotting) {
    return MOCK_DATA.game;
  }

  return game;
};

export const useIncoming = (): Incoming => useGame().incoming;
export const useCreatedWords = (): string[] => useGame().createdWords;
export const useRows = (): GameRow[] => useGame().rows;
export const useCurrentTurn = (): number => useGame().turn;
