import {
  Canvas,
  Easing,
  Glyph,
  Glyphs,
  Group,
  Mask,
  Rect,
  runTiming,
  SkiaReadonlyValue,
  useDerivedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { FONT_SIZE, MatchedWord } from '../../utils';
import {
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
  onViewXOffset: (x: number) => void;
};

const RotatableGrid = ({
  rows,
  rotation,
  rowWidth,
  height,
  highlights,
  showGutters,
  onViewXOffset,
}: Props) => {
  const width = useCanvasWidth();
  const charWidth = useCharWidth();
  const font = useCanvasFont();
  const textColor = useTextColor();
  const highlightColor = useTextColor('warning');

  const [prevRotation, setPrevRotation] = useState(rotation);
  const xOffset = useValue(0);

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
      runTiming(xOffset, newOffset, { duration, easing: Easing.elastic(0.9) });
      setTimeout(() => {
        handleRotationComplete(rotation);
      }, duration);
    }
  }, [rotation, rowWidth]);

  const glyphs: SkiaReadonlyValue<Glyph[]> = useDerivedValue(
    (offset: number) => {
      if (!font) {
        return [];
      }

      const getXPosition = (i: number) => {
        const positionInRow = 1 + ((i + prevRotation) % rowWidth);
        return positionInRow * charWidth + offset;
      };

      const ret: Glyph[] = [];

      rows.forEach((row, rowIndex) => {
        const y = FONT_SIZE * (rowIndex + 1);
        font.getGlyphIDs(row).forEach((id, i) =>
          ret.push({
            id,
            pos: vec(getXPosition(i), y),
          })
        );

        const firstChar = row[(rowWidth - prevRotation) % rowWidth];
        const secondChar = row[(rowWidth - prevRotation + 1) % rowWidth];
        const lastChar = row[(2 * rowWidth - prevRotation - 1) % rowWidth];
        const secondToLastChar =
          row[(2 * rowWidth - prevRotation - 2) % rowWidth];

        ret.push({
          id: font.getGlyphIDs(firstChar)[0],
          pos: vec((rowWidth + 1) * charWidth + offset, y),
        });
        ret.push({
          id: font.getGlyphIDs(secondChar)[0],
          pos: vec((rowWidth + 2) * charWidth + offset, y),
        });
        ret.push({
          id: font.getGlyphIDs(lastChar)[0],
          pos: vec(offset, y),
        });
        ret.push({
          id: font.getGlyphIDs(secondToLastChar)[0],
          pos: vec(offset - charWidth, y),
        });
      });

      return ret;
    },
    [xOffset]
  );

  const highlighted: SkiaReadonlyValue<Glyph[]> = useDerivedValue(
    (offset: number) => {
      if (!font || !highlights) {
        return [];
      }

      const getXPosition = (i: number) => {
        const positionInRow = 1 + ((i + prevRotation) % rowWidth);
        return positionInRow * charWidth + offset;
      };

      const ret: Glyph[] = [];
      const { word, chars } = highlights;

      font.getGlyphIDs(word).forEach((id, i) =>
        ret.push({
          id,
          pos: vec(getXPosition(chars[i].x), FONT_SIZE * (chars[i].y + 1)),
        })
      );

      return ret;
    },
    [xOffset]
  );

  const screenWidth = useWindowDimensions().width;
  useEffect(() => {
    onViewXOffset((screenWidth - width) / 2);
  }, [onViewXOffset, screenWidth, width]);

  if (!font) {
    return <Text>Nothing</Text>;
  }

  const gutterOpacity = showGutters ? 0.2 : 0;
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
      </Mask>
    </Canvas>
  );
};

export default RotatableGrid;
