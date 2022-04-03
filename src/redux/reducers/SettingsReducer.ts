import { AnyAction } from 'redux';
import { AppSetting, FontSize, MinLength } from '../../utils/types';
import { reset, setAppSetting } from '../actions';

export type SettingsState = {
  [AppSetting.HAS_REQUESTED_REVIEW]: boolean;
  [AppSetting.AUTOMATIC_WORD_FIND]: boolean;
  [AppSetting.SHOW_GUTTERS]: boolean;
  [AppSetting.ALLOW_DIAGONAL]: boolean;
  [AppSetting.VERTICAL_GRID_LINES]: boolean;
  [AppSetting.ANIMATIONS_ENABLED]: boolean;
  [AppSetting.NEW_CHAR_COUNT]: number;
  [AppSetting.ROW_WIDTH]: number;
  [AppSetting.LETTER_EASINESS]: number;
  [AppSetting.FONT_SIZE]: FontSize;
  [AppSetting.MIN_WORD_LETTER_COUNT]: MinLength;
  [AppSetting.SKIA_ENABLED]: boolean;
  [AppSetting.NUM_ROWS]: number;
};

const initialState: SettingsState = {
  [AppSetting.ANIMATIONS_ENABLED]: false,
  [AppSetting.HAS_REQUESTED_REVIEW]: false,
  [AppSetting.AUTOMATIC_WORD_FIND]: false,
  [AppSetting.VERTICAL_GRID_LINES]: true,
  [AppSetting.SHOW_GUTTERS]: true,
  [AppSetting.ALLOW_DIAGONAL]: true,
  [AppSetting.NEW_CHAR_COUNT]: 2,
  [AppSetting.ROW_WIDTH]: 8,
  [AppSetting.LETTER_EASINESS]: 1,
  [AppSetting.FONT_SIZE]: FontSize.Small,
  [AppSetting.MIN_WORD_LETTER_COUNT]: 4,
  [AppSetting.SKIA_ENABLED]: true,
  [AppSetting.NUM_ROWS]: 10,
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
