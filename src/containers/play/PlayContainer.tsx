import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, IconButton, Layout, Text, View } from '../../components/base';
import ActiveGrid from '../../components/play/ActiveGrid';
import {
  advanceGame,
  reset,
  rotateRows,
  setIncoming,
} from '../../redux/actions';
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
                setIncoming({ ...incoming, position: incoming.position - 1 })
              )
            }
            label="L"
          />
          <Button
            onPress={() =>
              dispatch(
                setIncoming({ ...incoming, position: incoming.position + 1 })
              )
            }
            label="R"
          />
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
          <Button label="Add" onPress={() => dispatch(advanceGame())}>
            Add
          </Button>
        </View>

        <ActiveGrid
          rotation={game.rotations}
          rows={game.rows}
          onRotate={(left) => dispatch(rotateRows(left))}
        />

        <View row>
          <Button
            onPress={() => dispatch(rotateRows(true))}
            label="Rotate Left"
          />
          <Button
            onPress={() => dispatch(rotateRows(false))}
            label="Rotate Right"
          />
        </View>
        <Button onPress={() => dispatch(reset())} label="Reset" />

        <Text>
          {'\n\n\n'} {JSON.stringify(game, undefined, 2)}
        </Text>
      </SafeAreaView>
    </Layout>
  );
};

export default PlayContainer;
