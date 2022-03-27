import Status from '../../components/play/Status';
type Props = {
  currentWord: string | undefined;
  onShiftIncoming: ((left: boolean) => void) | undefined;
  onAddIncoming: VoidFunction | undefined;
  onRotateIncoming: VoidFunction | undefined;
};

const StatusContainer = ({
  currentWord,
  onShiftIncoming,
  onAddIncoming,
  onRotateIncoming,
}: Props) => {
  return (
    <Status
      onShift={onShiftIncoming}
      onTap={onRotateIncoming}
      onFlingDown={onAddIncoming}
      currentWord={currentWord}
    />
  );
};

export default StatusContainer;
