import { createAction } from '@reduxjs/toolkit';
import { Game, GameRow, GameStat, Incoming } from '../../utils';
import { AnimationState } from '../reducers/AnimationReducer';
import { SettingsState } from '../reducers/SettingsReducer';

// App
export const reset = createAction('App/RESET');
export const setAppSetting =
  createAction<Partial<SettingsState>>('App/SET_SETTING');
export const resetWalkthrough = createAction('App/RESET_WALKTHROUGH');

// Stats
export const setGameStat = createAction<Partial<GameStat>>('Stats/SET_STAT');

// Game
export const setGame = createAction<Game>('Game/SET');
export const setRows = createAction<GameRow[]>('Game/SET_ROWS');
export const setIncoming = createAction<Incoming>('Game/SET_INCOMING');
export const rotateRows = createAction<boolean>('Game/ROTATE_ROWS');

export const setAnimation =
  createAction<Partial<AnimationState>>('Animation/SET');
