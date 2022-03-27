import {
  Canvas,
  Easing,
  Glyph,
  Glyphs,
  Group,
  interpolate,
  Line,
  Mask,
  Rect,
  runTiming,
  SkiaReadonlyValue,
  useDerivedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { useAnimationState, useSetting } from '../../redux/selectors';
import {
  AppSetting,
  CharDesinations,
  CHAR_DROP_MS,
  MatchedWord,
} from '../../utils';
import {
  useBackgroundColor,
  useCanvasFont,
  useCanvasWidth,
  useCharWidth,
  useTextColor,
} from '../../utils/hooks';
import { Text } from '../base';

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
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  const width = useCanvasWidth();
  const charWidth = useCharWidth();
  const font = useCanvasFont();
  const textColor = useTextColor();
  const borderColor = useBackgroundColor(4);
  const highlightColor = useTextColor('warning');
  const { isDroppingIncoming } = useAnimationState();
  const [prevRotation, setPrevRotation] = useState(rotation);
  const xOffset = useValue(0);
  /** the progress of the character drop animation */
  const droppingProgress = useValue(0);

  useEffect(() => {
    if (charDestinations) {
      runTiming(droppingProgress, 1, { duration: CHAR_DROP_MS });
    } else {
      droppingProgress.current = 0;
    }
  });

  const handleRotationComplete = (r: number) => {
    xOffset.current = 0;
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
        runTiming(xOffset, newOffset, {
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

  const getXPosition = (i: number, offset: number) => {
    const positionInRow = 1 + ((i + prevRotation) % rowWidth);
    return positionInRow * charWidth + offset;
  };

  // When dropping incoming characters, we want them to show up as coming from the top of the grid, not
  // just the top of the board.
  const visibleRowsOnGrid = Math.floor(height / fontSize);
  const rowOffsetForDroppingChars = isDroppingIncoming
    ? visibleRowsOnGrid - rows.length
    : 0;

  const glyphs: SkiaReadonlyValue<Glyph[]> = useDerivedValue(
    (offset: number, dropProgress: number) => {
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
          dropProgress,
          [0, 1],
          [startY - rowOffsetForDroppingChars, endY]
        );
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
        font.getGlyphIDs(row).forEach((id, i) => {
          if (id !== spaceId) {
            ret.push({
              id,
              pos: vec(
                getXPosition(i, offset),
                constantY ?? getYPosition(rowIndex, i)
              ),
            });
          }
        });

        const modPlus = (n: number) => (2 * rowWidth + n) % rowWidth;

        const firstCol = modPlus(-prevRotation);
        const secondCol = modPlus(-prevRotation + 1);
        const lastCol = modPlus(-prevRotation - 1);
        const secondToLastCol = modPlus(-prevRotation - 2);
        const firstChar = row[firstCol];
        const secondChar = row[secondCol];
        const lastChar = row[lastCol];
        const secondToLastChar = row[secondToLastCol];

        ret.push({
          id: font.getGlyphIDs(firstChar)[0],
          pos: vec(
            (rowWidth + 1) * charWidth + offset,
            getYPosition(rowIndex, firstCol)
          ),
        });
        ret.push({
          id: font.getGlyphIDs(secondChar)[0],
          pos: vec(
            (rowWidth + 2) * charWidth + offset,
            getYPosition(rowIndex, secondCol)
          ),
        });
        ret.push({
          id: font.getGlyphIDs(lastChar)[0],
          pos: vec(offset, getYPosition(rowIndex, lastCol)),
        });
        ret.push({
          id: font.getGlyphIDs(secondToLastChar)[0],
          pos: vec(offset - charWidth, getYPosition(rowIndex, secondToLastCol)),
        });
      });

      return ret;
    },
    [xOffset, droppingProgress]
  );

  const highlighted: SkiaReadonlyValue<Glyph[]> = useDerivedValue(
    (offset: number) => {
      if (!font || !highlights) {
        return [];
      }
      const ret: Glyph[] = [];
      const { word, chars } = highlights;

      font.getGlyphIDs(word).forEach((id, i) =>
        ret.push({
          id,
          pos: vec(
            getXPosition(chars[i].x, offset),
            fontSize * (chars[i].y + 1) + yOffset
          ),
        })
      );

      return ret;
    },
    [xOffset]
  );

  if (!font) {
    return <Text>Loading fonts...</Text>;
  }

  const gutterOpacity = showGutters ? 0.15 : 0;
  return (
    <Canvas style={{ width }}>
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
        <Group color={textColor}>
          <Glyphs glyphs={glyphs} font={font} />
        </Group>
        <Group color={highlightColor}>
          <Glyphs glyphs={highlighted} font={font} />
        </Group>
        {showGridLines ? (
          <Group color={borderColor}>
            {new Array(rowWidth + 2).fill(null).map((_, i) => (
              <Line
                key={i}
                p1={vec(charWidth * i, 0)}
                p2={vec(charWidth * i, height)}
                strokeWidth={1}
              />
            ))}
          </Group>
        ) : undefined}
      </Mask>
    </Canvas>
  );
};

export default RotatableGrid;
