import { useEffect } from 'react';
import { OutputTable, Text, View } from '../../components/base';
import { StatsState } from '../../redux/reducers/StatsReducer';
import { useStats } from '../../redux/selectors';
import { GameStat, getWordScore, MyConstants } from '../../utils';

const getLabel = (stat: GameStat): string =>
  ({
    [GameStat.TOTAL_GAMES]: 'Games Played',
    [GameStat.TOTAL_TURNS]: 'Average Turns per Game',
    [GameStat.TOTAL_SCORE]: 'Average Score per Game',
    [GameStat.TOTAL_WORDS]: 'Words Found',
    [GameStat.HIGH_SCORE]: 'High Score',
    [GameStat.HIGH_TURNS]: 'Most Turns',
    [GameStat.LONGEST_WORD]: 'Longest Word',
    [GameStat.HIGHEST_SCORING_WORD]: 'Highest Scoring Word',
  }[stat]);

const getValue = (
  stats: StatsState,
  stat: GameStat
): string | number | undefined => {
  const value = stats[stat];
  switch (stat) {
    case GameStat.HIGHEST_SCORING_WORD:
      return value ? `${value} (${getWordScore(value as string)})` : undefined;
    case GameStat.TOTAL_TURNS:
    case GameStat.TOTAL_SCORE: {
      const total = stats[GameStat.TOTAL_GAMES] ?? 0;
      return value != null && total
        ? ((value as number) / total).toFixed(0)
        : 0;
    }
    default:
      return value;
  }
};

type Props = { setShareMessage: (message: string) => void };

export default ({ setShareMessage }: Props) => {
  const stats = useStats();
  const data = Object.values(GameStat)
    .map((stat) => ({
      label: getLabel(stat),
      value: getValue(stats, stat),
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
  const gamesPlayed = stats[GameStat.TOTAL_GAMES] ?? 0;
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
