import { AnyAction } from 'redux';
import { MatchedWord } from '../../utils';
import { reset, setAnimation } from '../actions';

export type AnimationState = {
  isDroppingChars: boolean;
  matchedWords?: MatchedWord[];
};

const initialState: AnimationState = {
  isDroppingChars: false,
};

const AnimationReducer = (
  state = initialState,
  action: AnyAction
): AnimationState => {
  if (setAnimation.match(action)) {
    return { ...state, ...action.payload };
  } else if (reset.match(action)) {
    return initialState;
  }
  return state;
};

export default AnimationReducer;
