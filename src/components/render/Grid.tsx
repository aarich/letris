import { useMemo, useState } from 'react';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { Gesture as GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import { useSetting } from '../../redux/selectors';
import { AppSetting, CharDesinations, MatchedWord } from '../../utils';
import { useCanvasWidth, useCharWidth, useFontSize } from '../../utils/hooks';
import { View } from '../base';
import RotatableGrid from './RotatableGrid';
import RotatableGridSvg from './RotatableGridSvg';

type Props = {
  rows: string[];
  rotation: number;
  matchedWord?: MatchedWord;
  onFlingHorizontal?: (left: boolean) => void;
  onFlingVertical?: (down: boolean) => void;
  onTap?: (row: number, col: number) => void;
  onPan?: (row: number, col: number) => void;
  onPanEnd?: VoidFunction;
  height?: number;
  charDestinations?: CharDesinations;
  showGridLines?: boolean;
};

const fling = (d: Directions, action: VoidFunction) =>
  Gesture.Fling().direction(d).onStart(action).runOnJS(true);

const Grid = ({
  rows,
  rotation,
  matchedWord,
  height,
  charDestinations,
  showGridLines = false,
  onFlingHorizontal,
  onFlingVertical,
  onTap,
  onPan,
  onPanEnd,
}: Props) => {
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const showGutters = useSetting(AppSetting.SHOW_GUTTERS);
  const fontSize = useFontSize();
  const charWidth = useCharWidth();
  const [calculatedHeight, setHeight] = useState(500);
  const width = useCanvasWidth();
  const yOffset = calculatedHeight - fontSize * rows.length;

  const gesture = useMemo(() => {
    const gestures: GestureType[] = [];

    if (onFlingHorizontal) {
      gestures.push(
        fling(Directions.RIGHT, () => onFlingHorizontal(false)),
        fling(Directions.LEFT, () => onFlingHorizontal(true))
      );
    }
    if (onFlingVertical) {
      gestures.push(
        fling(Directions.DOWN, () => onFlingVertical(true)),
        fling(Directions.UP, () => onFlingVertical(false))
      );
    }

    const convertCanvasCoordToGrid = (x: number, y: number) => {
      const col = Math.floor(x / charWidth) - 1;
      const row = Math.floor((y - yOffset) / fontSize);
      return { row, col };
    };

    if (onPan) {
      gestures.push(
        Gesture.Pan()
          .maxPointers(1)
          .onStart(({ x, y }) => {
            const { row, col } = convertCanvasCoordToGrid(x, y);
            onPan(row, col);
          })
          .onChange(({ x, y }) => {
            const { row, col } = convertCanvasCoordToGrid(x, y);
            onPan(row, col);
          })
          .onEnd(() => onPanEnd && onPanEnd())
          .runOnJS(true)
      );
    }

    if (onTap) {
      gestures.push(
        Gesture.Tap()
          .onStart(({ x, y }) => {
            const { row, col } = convertCanvasCoordToGrid(x, y);
            onTap(row, col);
          })
          .runOnJS(true)
      );
    }

    return Gesture.Exclusive(...gestures);
  }, [
    charWidth,
    fontSize,
    onFlingHorizontal,
    onFlingVertical,
    onPan,
    onPanEnd,
    onTap,
    yOffset,
  ]);

  const useSkia = useSetting(AppSetting.SKIA_ENABLED);
  const GridElement = useSkia ? RotatableGrid : RotatableGridSvg;

  return (
    <GestureDetector gesture={gesture}>
      <View
        row
        center
        style={{ height, width }}
        onLayout={({ nativeEvent: { layout } }) => setHeight(layout.height)}
      >
        <GridElement
          rotation={rotation}
          rows={rows}
          height={height ?? calculatedHeight}
          rowWidth={rowWidth}
          highlights={matchedWord}
          yOffset={yOffset}
          showGutters={showGutters}
          charDestinations={charDestinations}
          showGridLines={showGridLines}
        />
      </View>
    </GestureDetector>
  );
};

export default Grid;
