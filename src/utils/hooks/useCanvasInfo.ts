import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { SkFont, useFont } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useSetting } from '../../redux/selectors';
import { AppSetting } from '../types';

export const useCanvasFont = (): SkFont | null => {
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  return useFont(RobotoMono_400Regular, fontSize);
};

export const useCanvasWidth = (): number => {
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  const isSmall = fontSize <= 32;
  return useWindowDimensions().width * (isSmall ? 0.6 : 0.7);
};

export const useCharWidth = (): number => {
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const width = useCanvasWidth();
  return width / (rowWidth + 2); // + 2 to accommodate first and last extra chars
};
