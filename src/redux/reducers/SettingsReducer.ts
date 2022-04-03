import { AnyAction } from 'redux';
import { MEDIUM_GAME_SETTINGS } from '../../utils';
import { AppSetting, FontSize, SettingsState } from '../../utils/types';
import { reset, setAppSetting } from '../actions';

const initialState: SettingsState = {
  [AppSetting.ANIMATIONS_ENABLED]: false,
  [AppSetting.HAS_REQUESTED_REVIEW]: false,
  [AppSetting.VERTICAL_GRID_LINES]: true,
  [AppSetting.SHOW_GUTTERS]: true,
  [AppSetting.FONT_SIZE]: FontSize.Small,
  [AppSetting.SKIA_ENABLED]: true,
  ...MEDIUM_GAME_SETTINGS,
};

const SettingsReducer = (
  state = initialState,
  action: AnyAction
): SettingsState => {
  if (setAppSetting.match(action)) {
    return { ...state, ...action.payload };
  } else if (reset.match(action)) {
    return initialState;
  }
  return state;
};

export default SettingsReducer;
