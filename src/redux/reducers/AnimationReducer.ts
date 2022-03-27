import { AnyAction } from 'redux';
import { MatchedWord } from '../../utils';
import { newGame, reset, resetGameAction, setAnimation } from '../actions';

export type AnimationState = {
  isDroppingChars: boolean;
  isDroppingIncoming: boolean;
  matchedWords?: MatchedWord[];
};

const initialState: AnimationState = {
  isDroppingChars: false,
  isDroppingIncoming: false,
};

const AnimationReducer = (
  state = initialState,
  action: AnyAction
): AnimationState => {
  if (setAnimation.match(action)) {
    return { ...state, ...action.payload };
  } else if (
    reset.match(action) ||
    newGame.match(action) ||
    resetGameAction.match(action)
  ) {
    return initialState;
  }
  return state;
};

export default AnimationReducer;
