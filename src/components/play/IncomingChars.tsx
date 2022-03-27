import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIncoming, useSetting } from '../../redux/selectors';
import { AppSetting, IconsOutlined } from '../../utils';
import { Button, Layout, View } from '../base';
import Grid from '../render/Grid';
type Props = {
  rows: string[];
  onGoBack: VoidFunction;
  onPressHelp: VoidFunction;
  onTap: VoidFunction;
  onShift: (left: boolean) => void;
  onFlingVertical: (down: boolean) => void;
};

const IncomingChars = ({
  rows,
  onFlingVertical,
  onGoBack,
  onPressHelp,
  onShift,
  onTap,
}: Props) => {
  const incoming = useIncoming();
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const fontSize = useSetting(AppSetting.FONT_SIZE);
  const paddingTop = useSafeAreaInsets().top;

  return (
    <View row center>
      <Layout l2 style={[styles.layout, { paddingTop }]}>
        <Button
          icon={{ name: IconsOutlined.arrowheadLeft }}
          ghost
          status="basic"
          onPress={onGoBack}
        />
        <Grid
          onFlingVertical={onFlingVertical}
          onFlingHorizontal={onShift}
          onTap={onTap}
          rotation={incoming.position}
          rows={rows}
          height={fontSize * 1.05 * newCharCount}
          onMaxRowsReached={() => null}
        />
        <Button
          icon={{ name: IconsOutlined.questionMarkCircle }}
          ghost
          status="basic"
          onPress={onPressHelp}
        />
      </Layout>
    </View>
  );
};

export default IncomingChars;

const styles = StyleSheet.create({
  layout: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
});
