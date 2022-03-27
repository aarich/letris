import { useCallback, useRef } from 'react';
import { Layout } from '../../components/base';
import { resetGame } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { alert, RootStackNavigationProp } from '../../utils';
import { useMatchedWordReducer } from '../../utils/hooks';
import ActiveBoardContainer from './ActiveBoardContainer';
import IncomingContainer, { IncomingContainerRef } from './IncomingContainer';
import StatusContainer from './StatusContainer';

type Props = { navigation: RootStackNavigationProp<'Play'> };

const PlayContainer = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const onPressHelp = useCallback(
    () =>
      alert(
        'Instructions',
        'Choose a spot to drop the characters into the game below. ' +
          'Tap to rotate, swipe left and right to adjust the drop zone. ' +
          'Swipe down to drop. You can also shift and rotate the incoming characters by swiping and tapping the space below the game grid.\n\nTry to make words out of the grid ' +
          'below. Swipe left and right to shift the characters around.\n\n' +
          'To highlight a word, tap a character, then tap or swipe through the remaining characters of the word. ' +
          '',
        [
          { text: 'Full Instructions', onPress: () => navigation.push('Help') },
          {
            text: 'Reset Game',
            onPress: () => dispatch(resetGame()),
            style: 'destructive',
          },
        ],
        'Ok'
      ),
    [dispatch, navigation]
  );

  const incomingRef = useRef<IncomingContainerRef>(null);
  const [matchedWord, selectChar] = useMatchedWordReducer();
  const onGoBack = useCallback(() => navigation.pop(), [navigation]);
  const onGoToStats = useCallback(() => navigation.push('Stats'), [navigation]);

  return (
    <Layout flex style={{}}>
      <IncomingContainer
        ref={incomingRef}
        onGoBack={onGoBack}
        onPressHelp={onPressHelp}
      />
      <ActiveBoardContainer
        matchedWord={matchedWord}
        selectChar={selectChar}
        onGoHome={onGoBack}
        onGoToStats={onGoToStats}
      />
      <StatusContainer
        currentWord={matchedWord?.word}
        onShiftIncoming={(l) => incomingRef.current?.shift(l)}
        onAddIncoming={() => incomingRef.current?.add()}
        onRotateIncoming={() => incomingRef.current?.rotate()}
      />
    </Layout>
  );
};

export default PlayContainer;
