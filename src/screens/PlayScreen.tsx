import { useEffect } from 'react';
import { Layout } from '../components/base';
import PlayContainer from '../containers/play/PlayContainer';
import { setIncoming } from '../redux/actions';
import { useIncoming, useSetting } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AppSetting, createNewIncoming, RootStackScreenProps } from '../utils';

type Props = RootStackScreenProps<'Play'>;

const PlayScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const incoming = useIncoming();
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const letterEasiness = useSetting(AppSetting.LETTER_EASINESS);
  useEffect(() => {
    // If the game is reset we need to populate the incoming chars with the right length
    if (incoming.chars.length !== newCharCount) {
      dispatch(setIncoming(createNewIncoming(newCharCount, letterEasiness)));
    }
  }, [dispatch, incoming.chars, letterEasiness, newCharCount]);

  return (
    <Layout flex l2>
      <PlayContainer navigation={navigation} />
    </Layout>
  );
};

export default PlayScreen;
