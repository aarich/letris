import { useCallback } from 'react';
import Status from '../../components/play/Status';
import { useSetting } from '../../redux/selectors';
import { alert, AppSetting, LetterEasiness } from '../../utils';

type Props = {
  currentWord: string | undefined;
  onShiftIncoming: ((left: boolean) => void) | undefined;
  onAddIncoming: VoidFunction | undefined;
  onRotateIncoming: VoidFunction | undefined;
  onGoBack: VoidFunction;
  onPressHelp: VoidFunction;
  onGoToSettings: VoidFunction;
};

const StatusContainer = ({
  currentWord,
  onShiftIncoming,
  onAddIncoming,
  onRotateIncoming,
  onGoBack,
  onPressHelp,
  onGoToSettings,
}: Props) => {
  const letterEasiness = useSetting(AppSetting.LETTER_EASINESS);
  const minWordLetterCount = useSetting(AppSetting.MIN_WORD_LETTER_COUNT);
  const autoWordFind = useSetting(AppSetting.AUTOMATIC_WORD_FIND);
  const allowDiagonal = useSetting(AppSetting.ALLOW_DIAGONAL);

  const showSettings = useCallback(() => {
    const le = {
      [LetterEasiness.Easy]: 'easy',
      [LetterEasiness.Medium]: 'medium',
      [LetterEasiness.Hard]: 'hard',
    }[letterEasiness];

    let msg = `Letter difficulty is ${le}.\n`;
    msg += `Automatic word detection is ${autoWordFind ? 'on' : 'off'}.\n`;
    msg += `Words must have at least ${minWordLetterCount} characters.\n`;
    msg += `Diagonal letters can${allowDiagonal ? '' : 'not'} be connected.`;
    alert(
      'Current Settings',
      msg,
      [{ text: 'Edit Settings', onPress: onGoToSettings }],
      'Ok'
    );
  }, [
    allowDiagonal,
    autoWordFind,
    letterEasiness,
    minWordLetterCount,
    onGoToSettings,
  ]);
  return (
    <Status
      currentWord={currentWord}
      onShift={onShiftIncoming}
      onTap={onRotateIncoming}
      onFlingDown={onAddIncoming}
      onGoBack={onGoBack}
      onPressHelp={onPressHelp}
      onPressSettings={showSettings}
    />
  );
};

export default StatusContainer;
