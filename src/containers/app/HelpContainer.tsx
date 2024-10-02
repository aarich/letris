import TextWall from '../../components/app/TextWall';
import { h3, p } from '../../components/base/io/Text';
import { MyConstants } from '../../utils';

const appName = MyConstants.expoConfig?.name;
const elements = [
  h3(`How do I play ${appName}?`),
  p(
    'The goal is to get as many points as possible before you run out of space. ' +
      'Earn points by creating words with adjacent letters.',
    'Drop a new set of characters into the board during each turn. ' +
      'You can shift them left or right (by swiping) or rotate them 90° (by tapping). ' +
      "When you're happy with where they will land, drop them into the board (by swiping down).",
    'To select a word, tap on a letter in the game board to start the word. It will turn yellow. ' +
      'Tap the remaining letters in the word, or drag your finger through them. ' +
      'Depending on the game settings you can connect letters horizontally or diagonally in any direction. ' +
      'You can customize the minimum word length in the game settings.',
    'You can also shift the board itself (by swiping). This lets you create words that wrap around the grid to the left or right.',
    'Tip: Use the area under the board to rotate and shift the incoming characters.'
  ),
];

const HelpContainer = () => {
  return <TextWall elements={elements} />;
};

export default HelpContainer;
