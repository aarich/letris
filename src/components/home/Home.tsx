import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useGame, useStats } from '../../redux/selectors';
import { GameStat, IconsOutlined, MyConstants, Spacings } from '../../utils';
import { Anchor, Button, HeaderButton, Text, View } from '../base';
import { p } from '../base/io/Text';

type Props = {
  onGoToPlay: VoidFunction;
  onToggleDrawer: VoidFunction;
};

const getTurnMsg = (turn: number): string => {
  if (turn > 9 || turn < 1) {
    return `You're on turn ${turn}`;
  } else {
    return `You're on your ${
      {
        [1]: 'first',
        [2]: 'second',
        [3]: 'third',
        [4]: 'fourth',
        [5]: 'fifth',
        [6]: 'sixth',
        [7]: 'seventh',
        [8]: 'eighth',
        [9]: 'ninth',
      }[turn]
    } turn.`;
  }
};

const Home = ({ onGoToPlay, onToggleDrawer }: Props) => {
  const stats = useStats();
  const { turn, rows, score } = useGame();
  const isStarted = rows.length > 0;
  const isNew = !isStarted && (stats[GameStat.TOTAL_GAMES] ?? 0) < 3;

  const c = (e: ReactNode) => (
    <View row center>
      {e}
    </View>
  );

  const renderWelcome = () => (
    <Text italic center style={styles.welcome} category="h6" status="primary">
      Welcome{isNew ? '' : ' Back'}!
    </Text>
  );

  const renderInProgressGameInfo = () =>
    isStarted ? (
      <>
        {c(p(getTurnMsg(turn)))}
        {c(p(`Current score: ${score}`))}
      </>
    ) : null;

  const renderGettingStarted = () =>
    isNew ? (
      <>
        <Text center>
          Find instructions and more by tapping the{' '}
          <Anchor onPress={() => onToggleDrawer()} text="menu" /> button above.
        </Text>
        {c(p(''))}
        {c(p('Or, dive right in!'))}
      </>
    ) : null;
  return (
    <View flex>
      <View row>
        <HeaderButton icon={IconsOutlined.menu} onPress={onToggleDrawer} />
      </View>
      <View flex center style={styles.container}>
        <Text h1 center style={styles.title}>
          {MyConstants.manifest?.name}
        </Text>
        <View style={styles.stats}>
          {renderWelcome()}
          {renderInProgressGameInfo()}
          {renderGettingStarted()}
        </View>
        <View row center>
          <Button
            onPress={onGoToPlay}
            label={isStarted ? 'Continue' : 'Play'}
            icon={{ name: IconsOutlined.arrowheadRight, onRight: true }}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { paddingBottom: Spacings.s4, paddingHorizontal: Spacings.s10 },
  title: { paddingBottom: Spacings.s8 },
  stats: { paddingBottom: Spacings.s6 },
  welcome: { paddingBottom: Spacings.s4 },
});
