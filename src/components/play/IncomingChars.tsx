import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIncoming, useSetting } from '../../redux/selectors';
import { AppSetting, Spacings } from '../../utils';
import { useFontSize } from '../../utils/hooks';
import { Layout } from '../base';
import Grid from '../render/Grid';
type Props = {
  rows: string[];
  onTap: VoidFunction;
  onShift: (left: boolean) => void;
  onFlingVertical: (down: boolean) => void;
};

const IncomingChars = ({ rows, onFlingVertical, onShift, onTap }: Props) => {
  const incoming = useIncoming();
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const fontSize = useFontSize();
  const paddingTop = useSafeAreaInsets().top - Spacings.s3;

  return (
    <Layout l2 style={[styles.layout, { paddingTop }]}>
      <Grid
        onFlingVertical={onFlingVertical}
        onFlingHorizontal={onShift}
        onTap={onTap}
        rotation={incoming.position}
        rows={rows}
        height={fontSize * newCharCount}
      />
    </Layout>
  );
};

export default IncomingChars;

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Spacings.s1,
  },
});
