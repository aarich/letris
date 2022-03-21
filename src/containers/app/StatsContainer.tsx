import { useEffect } from 'react';
import { OutputTable, Text, View } from '../../components/base';
import { useStats } from '../../redux/selectors';
import { GameStat, MyConstants } from '../../utils';

const getLabel = (stat: GameStat): string =>
  ({
    [GameStat.GAMES_PLAYED]: 'Games Played',
    [GameStat.HIGH_SCORE]: 'High Score',
    [GameStat.HIGH_TURNS]: 'Most Turns',
    [GameStat.AVERAGE_TURNS]: 'Average Turns per Game',
    [GameStat.LONGEST_WORD]: 'Longest Word',
    [GameStat.WORDS_FOUND]: 'Words Found',
  }[stat]);

type Props = { setShareMessage: (message: string) => void };

export default ({ setShareMessage }: Props) => {
  const stats = useStats();
  const data = Object.values(GameStat)
    .map((stat) => ({
      label: getLabel(stat),
      value: stats[stat],
    }))
    .filter(({ value }) => value);

  useEffect(
    () =>
      setShareMessage(
        `Here's how I'm doing on ${MyConstants.manifest?.name}!\n\n` +
          (data.length
            ? data.map(({ label, value }) => `${label}: ${value}`).join('\n')
            : "I'm a novice.")
      ),
    [data, setShareMessage]
  );

  let infoText = "You're just getting started";
  const gamesPlayed = stats.GAMES_PLAYED ?? 0;
  if (gamesPlayed > 10) {
    infoText = "You're testing the waters. Nice going!";
  } else if (gamesPlayed > 100) {
    infoText = 'You really like this game!';
  } else if (gamesPlayed > 1000) {
    infoText = 'You play a lot. Have you seen the sun recently?';
  }

  return (
    <>
      <OutputTable data={data} />
      <View flex center>
        <Text category="h6" center>
          {infoText}
        </Text>
      </View>
    </>
  );
};
