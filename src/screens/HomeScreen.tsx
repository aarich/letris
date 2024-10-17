import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { Layout } from '../components/base';
import HomeContainer from '../containers/home/HomeContainer';
import { DrawerParamList, RootStackScreenProps } from '../utils';

type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'HomeScreen'>,
  RootStackScreenProps<'Home'>
>;

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
