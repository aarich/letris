import { useEffect, useState } from 'react';
import Animated, {
  Easing,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAnimationState, useSetting } from '../../redux/selectors';
import {
  AppSetting,
  CharDesinations,
  CHAR_DROP_MS,
  MatchedWord,
} from '../../utils';
import {
  useBackgroundColor,
  useCanvasWidth,
  useCharWidth,
  useTextColor,
} from '../../utils/hooks';
import AnimatableSvg from './AnimatableSvg';

const AnimatedSvg = Animated.createAnimatedComponent(AnimatableSvg);

type Props = {
  rows: string[];
  rotation: number;
  height: number;
  rowWidth: number;
  highlights?: MatchedWord;
  showGutters: boolean;
  yOffset: number;
  showGridLines: boolean;
  charDestinations: CharDesinations | undefined;
};

const RotatableGridSvg = ({
  showGridLines,
  rows,
  rotation,
  rowWidth,
  height,
  highlights,
  showGutters,
  charDestinations,
  yOffset,
}: Props) => {
  const animate = useSetting(AppSetting.ANIMATIONS_ENABLED);
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  const charWidth = useCharWidth();
  const width = useCanvasWidth();
  const textColor = useTextColor();
  const borderColor = useBackgroundColor(4);
  const highlightColor = useTextColor('warning');

  const { isDroppingIncoming } = useAnimationState();
  const [prevRotation, setPrevRotation] = useState(rotation);
  const xOffset = useSharedValue(0);
  /** the progress of the character drop animation */
  const droppingProgress = useSharedValue(0);
  const rowsSV = useSharedValue(rows);
  const hightlighsSV = useSharedValue(highlights);
  const charDestinationsSV = useSharedValue(charDestinations);

  useEffect(() => {
    rowsSV.value = rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  useEffect(() => {
    hightlighsSV.value = highlights;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlights]);

  useEffect(() => {
    charDestinationsSV.value = charDestinations;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charDestinations]);

  useEffect(() => {
    if (charDestinations) {
      droppingProgress.value = withTiming(1, { duration: CHAR_DROP_MS });
    } else {
      droppingProgress.value = 0;
    }
  });

  const handleRotationComplete = (r: number) => {
    xOffset.value = 0;
    setPrevRotation(r);
  };

  useEffect(() => {
    if (prevRotation !== rotation) {
      let moveLeft = rotation < prevRotation;
      if (rotation === rowWidth - 1) {
        moveLeft = prevRotation === 0;
      } else if (rotation === 0) {
        moveLeft = prevRotation === 1;
      }

      const newOffset = charWidth * (moveLeft ? -1 : 1);
      const duration = 200;

      if (animate) {
        xOffset.value = withTiming(newOffset, {
          duration,
          easing: Easing.elastic(0.9),
        });
        setTimeout(() => {
          handleRotationComplete(rotation);
        }, duration);
      } else {
        handleRotationComplete(rotation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, rowWidth]);

  // When dropping incoming characters, we want them to show up as coming from the top of the grid, not
  // just the top of the board.
  const visibleRowsOnGrid = Math.floor(height / fontSize);
  const rowOffsetForDroppingChars = isDroppingIncoming
    ? visibleRowsOnGrid - rows.length
    : 0;

  type CharInfo = { c: string; x: number; y: number; g?: boolean; h?: boolean };

  const derivedChars = useDerivedValue<CharInfo[]>(() => {
    const getXPosition = (i: number) => {
      const positionInRow = 1 + ((i + prevRotation) % rowWidth);
      return positionInRow * charWidth + xOffset.value;
    };

    const getRow = (row: number, col: number): number => {
      const startY = row + 1;
      // endY is 0 if dest for this char is undefined (space)
      const endY = (charDestinations?.[row]?.[col] ?? -1) + 1;

      if (!endY || endY === startY) {
        return startY;
      }

      return interpolate(
        droppingProgress.value,
        [0, 1],
        [startY - rowOffsetForDroppingChars, endY]
      );
    };

    const getYPosition = (row: number, col: number): number => {
      return getRow(row, col) * fontSize + yOffset;
    };

    const chars: CharInfo[] = [];

    rows.forEach((row, rowIndex) => {
      const constantY = charDestinations
        ? undefined
        : getYPosition(rowIndex, 0);
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== ' ') {
          chars.push({
            c: row[i],
            x: getXPosition(i),
            y: constantY ?? getYPosition(rowIndex, i),
          });
        }
      }

      const modPlus = (n: number) => (2 * rowWidth + n) % rowWidth;

      const firstCol = modPlus(-prevRotation);
      const secondCol = modPlus(-prevRotation + 1);
      const lastCol = modPlus(-prevRotation - 1);
      const secondToLastCol = modPlus(-prevRotation - 2);
      const firstChar = row[firstCol];
      const secondChar = row[secondCol];
      const lastChar = row[lastCol];
      const secondToLastChar = row[secondToLastCol];

      firstChar !== ' ' &&
        chars.push({
          c: firstChar,
          x: (rowWidth + 1) * charWidth + xOffset.value,
          y: getYPosition(rowIndex, firstCol),
          g: true,
        });
      secondChar !== ' ' &&
        chars.push({
          c: secondChar,
          x: (rowWidth + 2) * charWidth + xOffset.value,
          y: getYPosition(rowIndex, secondCol),
          g: true,
        });
      lastChar !== ' ' &&
        chars.push({
          c: lastChar,
          x: xOffset.value,
          y: getYPosition(rowIndex, lastCol),
          g: true,
        });
      secondToLastChar !== ' ' &&
        chars.push({
          c: secondToLastChar,
          x: xOffset.value - charWidth,
          y: getYPosition(rowIndex, secondToLastCol),
          g: true,
        });
    });

    // add highlights
    if (highlights) {
      highlights.chars.forEach((char, i) =>
        chars.push({
          c: highlights.word[i],
          x: getXPosition(char.x),
          y: fontSize * (char.y + 1) + yOffset,
          h: true,
        })
      );
    }

    return chars;
  }, [droppingProgress, xOffset, rowsSV, hightlighsSV, charDestinationsSV]);

  return (
    <AnimatedSvg
      chars={derivedChars}
      height={height}
      rowWidth={rowWidth}
      showGridLines={showGridLines}
      showGutters={showGutters}
      fontSize={fontSize}
      width={width}
      charWidth={charWidth}
      textColor={textColor}
      borderColor={borderColor}
      highlightColor={highlightColor}
    />
  );
};

export default RotatableGridSvg;
