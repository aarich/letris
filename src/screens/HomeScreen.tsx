import { Layout } from '../components/base';
import HomeContainer from '../containers/home/HomeContainer';
import { RootStackScreenProps } from '../utils';

type Props = RootStackScreenProps<'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const onGoToPlay = () => navigation.push('Play');
  const onToggleDrawer = () => navigation.toggleDrawer();
  return (
    <Layout flex safe>
      <HomeContainer onGoToPlay={onGoToPlay} onToggleDrawer={onToggleDrawer} />
    </Layout>
  );
};

export default HomeScreen;
