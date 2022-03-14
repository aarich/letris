import { Layout } from '../components/base';
import HomeContainer from '../containers/home/HomeContainer';
import { RootStackScreenProps } from '../utils';

type Props = RootStackScreenProps<'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <Layout flex l2>
      <HomeContainer />
    </Layout>
  );
};

export default HomeScreen;
