import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, IconButton, Layout, Text, View } from '../../components/base';
import ActiveBoard from '../../components/play/ActiveBoard';
import IncomingChars from '../../components/play/IncomingChars';
import { setGame, setIncoming } from '../../redux/actions';
import { useGame, useIncoming } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { Direction, IconsOutlined } from '../../utils';

const getNextDirection = (dir: Direction): Direction =>
  ({
    [Direction.RIGHT]: Direction.DOWN,
    [Direction.DOWN]: Direction.LEFT,
    [Direction.LEFT]: Direction.UP,
    [Direction.UP]: Direction.RIGHT,
  }[dir]);

type Props = { onGoBack: VoidFunction };

const PlayContainer = ({ onGoBack }: Props) => {
  const game = useGame();
  const dispatch = useAppDispatch();
  const incoming = useIncoming();

  const { incoming: i2, rotations, createdWords } = game;

  return (
    <Layout flex>
      <SafeAreaView style={{ flex: 1 }}>
        <View row>
          <IconButton name={IconsOutlined.arrowheadLeft} onPress={onGoBack} />
        </View>
        <View row>
          <Button
            onPress={() =>
              dispatch(
                setIncoming({
                  ...incoming,
                  direction: getNextDirection(incoming.direction),
                })
              )
            }
            label="Rotate"
          />
        </View>

        <IncomingChars />
        <ActiveBoard />

        <Button
          onPress={() =>
            dispatch(setGame({ ...game, rows: ['ABCDEFGH'], createdWords: [] }))
          }
          label="Reset"
        />

        <View row>
          <Text flex={1}>{JSON.stringify(i2, undefined, 2)}</Text>
          <Text flex={1}>
            {JSON.stringify({ rotations, createdWords }, undefined, 2)}
          </Text>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default PlayContainer;
