import { useCallback } from 'react';
import Status from '../../components/play/Status';
import { useSetting } from '../../redux/selectors';
import { alert, AppSetting } from '../../utils';

type Props = {
  currentWord: string | undefined;
  onShiftIncoming: ((left: boolean) => void) | undefined;
  onAddIncoming: VoidFunction | undefined;
  onRotateIncoming: VoidFunction | undefined;
  onGoBack: VoidFunction;
  onPressHelp: VoidFunction;
};

const StatusContainer = ({
  currentWord,
  onShiftIncoming,
  onAddIncoming,
  onRotateIncoming,
  onGoBack,
  onPressHelp,
}: Props) => {
  const letterEasiness = useSetting(AppSetting.LETTER_EASINESS);
  const minWordLetterCount = useSetting(AppSetting.MIN_WORD_LETTER_COUNT);
  const autoWordFind = useSetting(AppSetting.AUTOMATIC_WORD_FIND);
  const allowDiagonal = useSetting(AppSetting.ALLOW_DIAGONAL);

  const showSettings = useCallback(() => {
    let letterDifficulty = 'easy';
    if (letterEasiness === 0.5) {
      letterDifficulty = 'medium';
    } else if (letterEasiness === 1) {
      letterDifficulty = 'hard';
    }
    const le = `Letter difficulty is ${letterDifficulty}.`;
    const awf = `Automatic word detection is ${autoWordFind ? 'on' : 'off'}.`;
    const mwlc = `Words must have at least ${minWordLetterCount} characters.`;
    const ad = `Diagonal letters can${
      allowDiagonal ? '' : 'not'
    } be connected.`;
    alert('Current Settings', `${le}\n${awf}\n${mwlc}\n${ad}`);
  }, [allowDiagonal, autoWordFind, letterEasiness, minWordLetterCount]);
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
