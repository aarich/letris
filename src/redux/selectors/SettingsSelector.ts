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

  let result = automaticWordFind ? 0.8 : 1;
  result *= newCharCount / 4;
  result *= (15 - rowWidth) / 10;
  result *= (letterEasiness + 3) / 4;
  result *= minWordLetterCount / 5;
  return result;
};

export const useEasinessLevel = (): string => {
  const score = useEasinessScore();
  if (score > 0.9) {
    return 'Expert';
  } else if (score > 0.8) {
    return 'Most Difficult';
  } else if (score > 0.7) {
    return 'Difficult';
  } else if (score > 0.6) {
    return 'Intermediate';
  }
  return 'Beginner';
};
