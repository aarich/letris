import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { keyed } from '../../utils';
import { Layout } from '../base';

type Props = {
  elements: ReactNode[];
};

const TextWall = ({ elements }: Props) => {
  const paddingBottom = useSafeAreaInsets().bottom;
  return (
    <Layout l2 flex>
      <ScrollView style={{ paddingBottom }}>{keyed([...elements])}</ScrollView>
    </Layout>
  );
};

export default TextWall;
