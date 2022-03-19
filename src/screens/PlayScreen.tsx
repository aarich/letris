import { useCallback } from 'react';
import { Layout } from '../components/base';
import PlayContainer from '../containers/play/PlayContainer';
import { RootStackScreenProps } from '../utils';

type Props = RootStackScreenProps<'Home'>;

const PlayScreen = ({ navigation }: Props) => {
  const onGoBack = useCallback(() => navigation.pop(), [navigation]);
  return (
    <Layout flex l2>
      <PlayContainer onGoBack={onGoBack} />
    </Layout>
  );
};

export default PlayScreen;
