import { AppSetting } from '../../utils';
import { SettingsState } from '../reducers/SettingsReducer';
import { useAppSelector } from '../store';

export const useSettings = (): SettingsState =>
  useAppSelector((state) => state.settings);

export const useSetting = <T extends AppSetting>(
  setting: T
): SettingsState[T] => useSettings()[setting];

export const useEasinessScore = (): number => {
  const automaticWordFind = useSetting(AppSetting.AUTOMATIC_WORD_FIND);
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const letterEasiness = useSetting(AppSetting.LETTER_EASINESS);
  const minWordLetterCount = useSetting(AppSetting.MIN_WORD_LETTER_COUNT);
  const allowDiagonal = useSetting(AppSetting.ALLOW_DIAGONAL);
  const numRows = useSetting(AppSetting.NUM_ROWS);

  let result = automaticWordFind ? 0.9 : 1;
  result *= allowDiagonal ? 0.9 : 1;
  result *= (8 + newCharCount) / 12;
  result *= (20 - rowWidth) / 10;
  result *= (letterEasiness + 3) / 4;
  result *= (5 + minWordLetterCount) / 12;
  result *= (20 + numRows) / (12 + 20);
  return result;
};

export const useEasinessLevel = (): string => {
  const score = useEasinessScore();
  if (score > 0.9) {
    return 'Expert';
  } else if (score > 0.8) {
    return 'Most Difficult';
  } else if (score > 0.65) {
    return 'Difficult';
  } else if (score > 0.4) {
    return 'Intermediate';
  }
  return 'Beginner';
};
