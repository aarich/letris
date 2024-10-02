import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import IncomingChars from '../../components/play/IncomingChars';
import { advanceGame, setIncoming } from '../../redux/actions';
import {
  useAnimationState,
  useIncoming,
  useSetting,
} from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { addIncomingChars, AppSetting, getNextDirection } from '../../utils';

export type IncomingContainerRef = {
  shift: (left: boolean) => void;
  rotate: VoidFunction;
  add: VoidFunction;
};

const IncomingContainer = forwardRef<IncomingContainerRef>((_, ref) => {
  const dispatch = useAppDispatch();
  const incoming = useIncoming();
  const { chars, direction } = incoming;
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const hideChars = useAnimationState().isDroppingIncoming;

  const rows = useMemo(() => {
    const ret: string[] = [];
    if (!hideChars) {
      ret.push(
        ...addIncomingChars({ direction, chars, rowWidth, rows: [], pos: 0 })
      );
    }
    while (ret.length < newCharCount) {
      ret.unshift(''.padEnd(rowWidth));
    }
    return ret;
  }, [chars, direction, hideChars, newCharCount, rowWidth]);

  const onShift = useCallback(
    (left: boolean) => {
      const newPosition = incoming.position + (left ? -1 : 1);
      const position = (rowWidth + newPosition) % rowWidth;
      dispatch(setIncoming({ ...incoming, position }));
    },
    [dispatch, incoming, rowWidth]
  );

  const onFlingVertical = useCallback(
    (down: boolean) => down && dispatch(advanceGame()),
    [dispatch]
  );
  const onRotate = useCallback(() => {
    dispatch(
      setIncoming({ ...incoming, direction: getNextDirection(direction) })
    );
  }, [direction, dispatch, incoming]);

  useImperativeHandle(ref, () => ({
    add: () => onFlingVertical(true),
    rotate: () => onRotate(),
    shift: (b) => onShift(b),
  }));

  return (
    <IncomingChars
      rows={rows}
      onShift={onShift}
      onTap={onRotate}
      onFlingVertical={onFlingVertical}
    />
  );
});

export default IncomingContainer;
