import { AnyAction } from 'redux';
import { AppSetting } from '../../utils/types';
import { setAppSetting } from '../actions';

export type SettingsState = {
  [AppSetting.HAS_REQUESTED_REVIEW]: boolean;
  [AppSetting.NEW_CHAR_COUNT]: number;
  [AppSetting.ROW_WIDTH]: number;
  [AppSetting.LETTER_EASINESS]: number;
};

const initialState: SettingsState = {
  [AppSetting.HAS_REQUESTED_REVIEW]: false,
  [AppSetting.NEW_CHAR_COUNT]: 2,
  [AppSetting.ROW_WIDTH]: 8,
  [AppSetting.LETTER_EASINESS]: 1,
};

const SettingsReducer = (
  state = initialState,
  action: AnyAction
): SettingsState => {
  if (setAppSetting.match(action)) {
    return { ...state, ...action.payload };
  }
  return state;
};

export default SettingsReducer;
