import { Component } from 'react';
import Animated, { DerivedValue } from 'react-native-reanimated';
import Svg, { Line, Text } from 'react-native-svg';

type CharInfo = { c: string; x: number; y: number; g?: boolean; h?: boolean };
const AnimatedText = Animated.createAnimatedComponent(Text);
type Props = {
  chars: Readonly<DerivedValue<CharInfo[]>>;
  height: number;
  rowWidth: number;
  showGutters: boolean;
  showGridLines: boolean;
  fontSize: number;
  width: number;
  charWidth: number;
  textColor: string;
  borderColor: string;
  highlightColor: string;
};

class AnimatableSvg extends Component<Props> {
  render() {
    const {
      showGridLines,
      chars,
      rowWidth,
      height,
      showGutters,
      fontSize,
      width,
      charWidth,
      textColor,
      borderColor,
      highlightColor,
    } = this.props;

    const gutterOpacity = showGutters ? 0.15 : 0;
    return (
      <Svg style={{ width }}>
        {chars.value.map(({ c, x, y, g, h }, i) => (
          <AnimatedText
            fill={h ? highlightColor : textColor}
            key={`${i}-${g}-${h}-${c}`}
            x={x}
            y={y}
            opacity={g ? gutterOpacity : 1}
            fontSize={fontSize}
            fontFamily="RobotoMono_400Regular"
          >
            {c}
          </AnimatedText>
        ))}

        {showGridLines
          ? new Array(rowWidth + 2)
              .fill(null)
              .map((_, i) => (
                <Line
                  stroke={borderColor}
                  key={i}
                  x1={charWidth * i}
                  y1={0}
                  x2={charWidth * i}
                  y2={height}
                  strokeWidth={1}
                />
              ))
          : undefined}
      </Svg>
    );
  }
}

export default AnimatableSvg;
