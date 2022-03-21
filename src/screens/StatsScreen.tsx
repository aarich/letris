import { Share } from 'react-native';
import { HeaderButton, Layout } from '../components/base';
import StatsContainer from '../containers/app/StatsContainer';
import { IconsOutlined, RootStackScreenProps, Spacings } from '../utils';

export default ({ navigation }: RootStackScreenProps<'Stats'>) => {
  const setShareMessage = (message: string) => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          icon={IconsOutlined.share}
          onPress={() => Share.share({ message })}
        />
      ),
    });
  };
  return (
    <Layout flex style={{ padding: Spacings.s2 }}>
      <StatsContainer setShareMessage={setShareMessage} />
    </Layout>
  );
};
