import { createAction } from '@reduxjs/toolkit';
import { GameRow, GameStat } from '../../utils';
import { GameState, IncomingState } from '../reducers/GameReducer';
import { SettingsState } from '../reducers/SettingsReducer';

// App
export const reset = createAction('App/RESET');
export const setAppSetting =
  createAction<Partial<SettingsState>>('App/SET_SETTING');

// Stats
export const setGameStat = createAction<Partial<GameStat>>('Stats/SET_STAT');

// Game
export const setGame = createAction<GameState>('Game/SET');
export const setRows = createAction<GameRow[]>('Game/SET_ROWS');
export const setIncoming = createAction<IncomingState>('Game/SET_INCOMING');
export const rotateRows = createAction<boolean>('Game/ROTATE_ROWS');
