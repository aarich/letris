import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { SkFont, useFont } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useSetting } from '../../redux/selectors';
import { AppSetting, FontSize } from '../types';

export const useCanvasWidth = (): number => useWindowDimensions().width * 0.9;

export const useCharWidth = (): number => {
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const width = useCanvasWidth();
  return width / (rowWidth + 2); // + 2 to accommodate first and last extra chars
};

export const useFontSize = (): number => {
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  const isCompactRowWidth = useSetting(AppSetting.ROW_WIDTH) > 8;
  const isCompactHeight =
    useSetting(AppSetting.NEW_CHAR_COUNT) + useSetting(AppSetting.NUM_ROWS) >
    12;

  switch (fontSize) {
    case FontSize.Large:
      return isCompactRowWidth || isCompactHeight ? 40 : 46;
    case FontSize.Small:
      return 36;
    default:
      return 36;
  }
};

export const useCanvasFont = (): SkFont | null =>
  useFont(RobotoMono_400Regular, useFontSize());

export const useFontCharWidth = (): number => {
  const font = useCanvasFont();
  const charWidth = useCharWidth();
  return font?.measureText('A')?.width ?? charWidth;
};
