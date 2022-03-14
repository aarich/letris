import { Button, Card, Text, View } from '../../components/base';
import {
  advanceGame,
  reset,
  rotateRows,
  setIncoming,
} from '../../redux/actions';
import { useGame, useIncoming } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { Direction, renderGame } from '../../utils';

const getNextDirection = (dir: Direction): Direction =>
  ({
    [Direction.RIGHT]: Direction.DOWN,
    [Direction.DOWN]: Direction.LEFT,
    [Direction.LEFT]: Direction.UP,
    [Direction.UP]: Direction.RIGHT,
  }[dir]);

const HomeContainer = () => {
  const game = useGame();
  const dispatch = useAppDispatch();
  const incoming = useIncoming();

  return (
    <>
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
      <Card>
        <Text style={{ fontVariant: ['tabular-nums'] }}>
          {renderGame(game)}
        </Text>
      </Card>

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
    </>
  );
};

export default HomeContainer;
