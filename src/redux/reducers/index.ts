/* eslint-disable filenames/match-exported */
import { combineReducers } from 'redux';
import game from './GameReducer';
import settings from './SettingsReducer';
import stats from './StatsReducer';

const rootReducer = combineReducers({ settings, game, stats });

export default rootReducer;
