import { useAppSelector } from '../store';

export const useAnimationState = () =>
  useAppSelector((state) => state.animations);
