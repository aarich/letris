import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { useFont } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useSetting } from '../../redux/selectors';
import { FONT_SIZE } from '../game';
import { AppSetting } from '../types';

export const useCanvasFont = () => {
  return useFont(RobotoMono_400Regular, FONT_SIZE);
};

export const useCanvasWidth = () => {
  return useWindowDimensions().width * 0.6;
};

export const useCharWidth = () => {
  const rowWidth = useSetting(AppSetting.ROW_WIDTH);
  const width = useCanvasWidth();
  return width / (rowWidth + 2); // + 2 to accommodate first and last extra chars
};
