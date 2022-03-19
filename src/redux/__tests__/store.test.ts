import { Direction } from '../../utils';
import { advanceGame, reset, rotateRows } from '../actions';
import GameReducer, { GameState } from '../reducers/GameReducer';
import SettingsReducer from '../reducers/SettingsReducer';
const game: GameState = {
  rows: ['IJKLMNOP', 'ABCDEFGH'],
  rotations: 0,
  createdWords: [],
  incoming: { chars: 'AB', direction: Direction.RIGHT, position: 0 },
  turn: 0,
};
const settings = SettingsReducer(undefined, reset());

describe('reducer', () => {
  describe('rotateRows', () => {
    test('right', () => {
      const expected = { ...game, rotations: 1 };
      expect(GameReducer(game, rotateRows(true))).toEqual(expected);
    });

    test('left', () => {
      const expected = { ...game, rotations: 7 };
      expect(GameReducer(game, rotateRows(false))).toEqual(expected);
    });
  });
});

describe('thunks', () => {
  const getState = jest.fn(() => ({ game, settings }));
  const dispatch = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoke = (thunk: any) => thunk(dispatch, getState);

  test('advanceGame', () => {
    invoke(advanceGame());

    expect(dispatch.mock.calls).toHaveLength(1);
    const {
      type,
      payload: {
        incoming: { position, direction },
        ...rest
      },
    } = dispatch.mock.calls[0][0];

    expect(type).toEqual('Game/SET');
    expect(rest).toEqual({
      rotations: 0,
      rows: ['AB      ', 'IJKLMNOP', 'ABCDEFGH'],
      createdWords: [],
      turn: 1,
    });
    expect(position).toEqual(0);
    expect(direction).toEqual(Direction.RIGHT);
  });
});
