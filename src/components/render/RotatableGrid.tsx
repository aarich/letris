import {
  BlurMask,
  Canvas,
  Glyph,
  Glyphs,
  Group,
  interpolate,
  Line,
  Mask,
  Points,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { finishedDroppingChars } from '../../redux/actions';
import { useAnimationState, useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import {
  AppSetting,
  CharDesinations,
  CHAR_DROP_MS,
  MatchedWord,
} from '../../utils';
import { CHAR_ROTATE_MS } from '../../utils/game';
import {
  useBackgroundColor,
  useCanvasFont,
  useCanvasWidth,
  useCharWidth,
  useFontCharWidth,
  useFontSize,
  useTextColor,
} from '../../utils/hooks';
import { Text } from '../base';
import {
  DerivedValue,
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@ui-kitten/components';

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

const RotatableGrid = ({
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
  const fontSize = useFontSize();
  const width = useCanvasWidth();
  const charWidth = useCharWidth();
  const fontCharWidth = useFontCharWidth();
  const font = useCanvasFont();
  const textColor = useTextColor();
  const gridColor = useBackgroundColor(2);
  const lineColor = useTheme()['color-warning-800'];
  const highlightColor = useTextColor('warning');
  const { isDroppingIncoming } = useAnimationState();
  const [prevRotation, setPrevRotation] = useState(rotation);
  const xOffset = useSharedValue(0);
  /** the progress of the character drop animation */
  const droppingProgress = useSharedValue(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dispatchFinished = () => dispatch(finishedDroppingChars());
    if (charDestinations) {
      droppingProgress.value = withTiming(
        1,
        { duration: CHAR_DROP_MS, easing: Easing.ease },
        () => runOnJS(dispatchFinished)()
      );
    } else {
      droppingProgress.value = 0;
    }
  }, [charDestinations, dispatch, droppingProgress]);

  useEffect(() => {
    if (prevRotation === rotation) {
      // Nothing to do
      return;
    }

    const handleRotationComplete = (r: number) => {
      xOffset.value = 0;
      setPrevRotation(r);
    };

    let moveLeft = rotation < prevRotation;
    if (rotation === rowWidth - 1) {
      moveLeft = prevRotation === 0;
    } else if (rotation === 0) {
      moveLeft = prevRotation === 1;
    }

    const newOffset = charWidth * (moveLeft ? -1 : 1);

    if (animate) {
      xOffset.value = withTiming(
        newOffset,
        {
          duration: CHAR_ROTATE_MS,
          easing: Easing.elastic(0.9),
        },
        () => runOnJS(handleRotationComplete)(rotation)
      );
    } else {
      handleRotationComplete(rotation);
    }
  }, [animate, charWidth, prevRotation, rotation, rowWidth, xOffset]);

  // When dropping incoming characters, we want them to show up as coming from the top of the grid, not
  // just the top of the board.
  const visibleRowsOnGrid = Math.floor(height / fontSize);
  const rowOffsetForDroppingChars = isDroppingIncoming
    ? visibleRowsOnGrid - rows.length
    : 0;

  const glyphs: DerivedValue<Glyph[]> = useDerivedValue(() => {
    if (!font) {
      return [];
    }

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

    const getXPosition = (i: number, offset: number) => {
      const positionInRow = 1 + ((i + prevRotation) % rowWidth);
      const offsetInCol = (charWidth - fontCharWidth) / 2;
      return positionInRow * charWidth + offset + offsetInCol;
    };

    const getYPosition = (row: number, col: number): number => {
      return getRow(row, col) * fontSize + yOffset;
    };

    const ret: Glyph[] = [];

    const spaceId = font.getGlyphIDs(' ')[0];

    rows.forEach((row, rowIndex) => {
      const constantY = charDestinations
        ? undefined
        : getYPosition(rowIndex, 0);
      const glyphIds = font.getGlyphIDs(row);

      glyphIds.forEach((id, i) => {
        if (id !== spaceId) {
          ret.push({
            id,
            pos: vec(
              getXPosition(i, xOffset.value),
              constantY ?? getYPosition(rowIndex, i)
            ),
          });
        }
      });

      const offsetInCol = (charWidth - fontCharWidth) / 2;
      const addChar = (originalCol: number, adjustedCol: number) =>
        glyphIds[originalCol] !== spaceId &&
        ret.push({
          id: glyphIds[originalCol],
          pos: vec(
            adjustedCol * charWidth + xOffset.value + offsetInCol,
            getYPosition(rowIndex, originalCol)
          ),
        });

      const modPlus = (n: number) => (2 * rowWidth + n) % rowWidth;
      const firstCol = modPlus(-prevRotation);
      const secondCol = modPlus(-prevRotation + 1);
      const lastCol = modPlus(-prevRotation - 1);
      const secondToLastCol = modPlus(-prevRotation - 2);

      addChar(firstCol, rowWidth + 1);
      addChar(secondCol, rowWidth + 2);
      addChar(lastCol, 0);
      addChar(secondToLastCol, -1);
    });

    return ret;
  }, [
    charDestinations,
    charWidth,
    droppingProgress,
    font,
    fontCharWidth,
    fontSize,
    prevRotation,
    rowOffsetForDroppingChars,
    rowWidth,
    rows,
    xOffset,
    yOffset,
  ]);

  const highlighted: DerivedValue<Glyph[]> = useDerivedValue(() => {
    if (!font || !highlights) {
      return [];
    }
    const ret: Glyph[] = [];
    const { word, chars } = highlights;

    const getXPosition = (i: number, offset: number) => {
      const positionInRow = 1 + ((i + prevRotation) % rowWidth);
      const offsetInCol = (charWidth - fontCharWidth) / 2;
      return positionInRow * charWidth + offset + offsetInCol;
    };

    font.getGlyphIDs(word).forEach((id, i) =>
      ret.push({
        id,
        pos: vec(
          getXPosition(chars[i].x, xOffset.value),
          fontSize * (chars[i].y + 1) + yOffset
        ),
      })
    );

    return ret;
  }, [font, highlights, xOffset, fontSize, yOffset]);

  if (!font) {
    return <Text>Loading fonts...</Text>;
  }

  const gutterOpacity = showGutters ? 0.15 : 0;

  const lines = [];

  const getXPosition = (i: number) => {
    const positionInRow = 1 + ((i + prevRotation) % rowWidth);
    const offsetInCol = (charWidth - fontCharWidth) / 2;
    return positionInRow * charWidth + offsetInCol + fontCharWidth / 2;
  };

  if (highlights?.chars) {
    for (let i = 0; i < highlights.chars.length; i++) {
      lines.push({
        x1: getXPosition(highlights.chars[i].x),
        // x2: getXPosition(highlights.chars[i + 1].x),
        y1: fontSize * (highlights.chars[i].y + 1) + yOffset - fontSize / 2,
        // y2: fontSize * (highlights.chars[i + 1].y + 1) + yOffset - fontSize / 2,
      });
    }
  }

  return (
    <Canvas style={{ width, height }}>
      <Mask
        mask={
          <Group>
            <Rect
              x={0}
              y={0}
              width={charWidth}
              height={height}
              opacity={gutterOpacity}
            />
            <Rect
              x={charWidth}
              y={0}
              width={width - charWidth * 2}
              height={height}
            />
            <Rect
              x={width - charWidth}
              y={0}
              width={charWidth}
              height={height}
              opacity={gutterOpacity}
            />
          </Group>
        }
      >
        {showGridLines
          ? new Array(rowWidth + 1)
              .fill(null)
              .map((_, i) => i)
              .filter((i) => i && i % 2 === 0)
              .map((i) => (
                <Rect
                  key={i}
                  x={charWidth * i}
                  y={0}
                  width={charWidth}
                  height={height}
                  color={gridColor}
                  style="fill"
                  strokeWidth={0}
                />
              ))
          : undefined}
        <Group color={lineColor}>
          <Points
            points={lines.map(({ x1, y1 }) => vec(x1, y1))}
            strokeWidth={4}
            style={'stroke'}
            strokeJoin={'round'}
            mode="polygon"
          />
        </Group>
        <Group color={textColor}>
          <Glyphs glyphs={glyphs} font={font} />
        </Group>
        <Group color={highlightColor}>
          <Glyphs glyphs={highlighted} font={font} />
        </Group>
      </Mask>
    </Canvas>
  );
};

export default RotatableGrid;
