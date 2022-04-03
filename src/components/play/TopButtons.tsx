import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconsOutlined } from '../../utils';
import { Button, Layout } from '../base';
type Props = {
  onGoBack: VoidFunction;
  onPressHelp: VoidFunction;
};

const TopButtons = ({ onGoBack, onPressHelp }: Props) => {
  const paddingTop = useSafeAreaInsets().top;

  return (
    <Layout l2 style={[styles.layout, { paddingTop }]}>
      <Button
        icon={{ name: IconsOutlined.arrowheadLeft }}
        ghost
        status="basic"
        onPress={onGoBack}
      />
      <Button
        icon={{ name: IconsOutlined.questionMarkCircle }}
        ghost
        status="basic"
        onPress={onPressHelp}
      />
    </Layout>
  );
};

export default TopButtons;

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
});
