import { Direction, Game } from '../../utils';
import { advanceGame, reset, rotateRows } from '../actions';
import GameReducer from '../reducers/GameReducer';
import SettingsReducer from '../reducers/SettingsReducer';
import StatsReducer from '../reducers/StatsReducer';
const game: Game = {
  rows: ['IJKLMNOP', 'ABCDEFGH'],
  rotations: 0,
  createdWords: [],
  incoming: { chars: 'AB', direction: Direction.RIGHT, position: 0 },
  turn: 0,
  score: 0,
};
const settings = SettingsReducer(undefined, reset());
const stats = StatsReducer(undefined, reset());

describe('reducer', () => {
  describe('rotateRows', () => {
    test('right', () => {
      const expected = { ...game, rotations: 1 };
      expect(GameReducer(game, rotateRows(false))).toEqual(expected);
    });

    test('left', () => {
      const expected = { ...game, rotations: 7 };
      expect(GameReducer(game, rotateRows(true))).toEqual(expected);
    });
  });
});

describe('thunks', () => {
  const getState = jest.fn(() => ({ game, settings, stats }));
  const dispatch = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoke = (thunk: any) => thunk(dispatch, getState);

  test('advanceGame', async () => {
    await invoke(advanceGame());

    expect(dispatch.mock.calls).toEqual([
      [{ payload: { HIGH_TURNS: 1 }, type: 'Stats/SET_STAT' }],
      [{ payload: { TOTAL_TURNS: 1 }, type: 'Stats/SET_STAT' }],
      [{ payload: { isDroppingIncoming: true }, type: 'Animation/SET' }],
      [
        {
          type: 'Game/SET',
          payload: {
            createdWords: [],
            incoming: { chars: expect.anything(), direction: 3, position: 0 },
            rotations: 0,
            rows: ['AB      ', 'IJKLMNOP', 'ABCDEFGH'],
            score: 0,
            turn: 1,
          },
        },
      ],
      expect.anything(),
    ]);
  });
});
