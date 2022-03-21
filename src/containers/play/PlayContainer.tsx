import { Button, Layout, Text, View } from '../../components/base';
import ActiveBoard from '../../components/play/ActiveBoard';
import IncomingChars from '../../components/play/IncomingChars';
import { resetGame } from '../../redux/actions';
import { useGame } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

type Props = { onGoBack: VoidFunction; onGoToHelp: VoidFunction };

const PlayContainer = ({ onGoBack, onGoToHelp }: Props) => {
  const game = useGame();
  const dispatch = useAppDispatch();

  const { incoming, rotations, createdWords } = game;

  return (
    <Layout flex>
      <IncomingChars onGoBack={onGoBack} onGoToHelp={onGoToHelp} />
      <ActiveBoard />

      <Button onPress={() => dispatch(resetGame())} label="Reset" />

      <View row>
        <Text flex={1}>{JSON.stringify(incoming, undefined, 2)}</Text>
        <Text flex={1}>
          {JSON.stringify({ rotations, createdWords }, undefined, 2)}
        </Text>
      </View>
    </Layout>
  );
};

export default PlayContainer;
