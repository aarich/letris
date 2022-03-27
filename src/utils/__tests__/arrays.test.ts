import { transpose } from '../arrays';

describe('transpose', () => {
  test.each([
    [['abc'], ['a', 'b', 'c']],
    [
      ['a ', ' b'],
      ['a ', ' b'],
    ],
    [[], []],
    [
      ['abc', 'def'],
      ['ad', 'be', 'cf'],
    ],
  ])('%p results in %p', (rows, expected) => {
    expect(transpose(rows)).toEqual(expected);
  });
});
