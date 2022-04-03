import { useEffect } from 'react';
import { Layout } from '../components/base';
import PlayContainer from '../containers/play/PlayContainer';
import { setIncomingChars } from '../redux/actions';
import { useIncoming, useSetting } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AppSetting, getRandomLetters, RootStackScreenProps } from '../utils';

type Props = RootStackScreenProps<'Play'>;

const PlayScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const { chars } = useIncoming();
  const newCharCount = useSetting(AppSetting.NEW_CHAR_COUNT);
  const letterEasiness = useSetting(AppSetting.LETTER_EASINESS);
  useEffect(() => {
    // If the game is reset we need to populate the incoming chars with the right length
    if (chars.length !== newCharCount) {
      dispatch(
        setIncomingChars(getRandomLetters(newCharCount, letterEasiness))
      );
    }
  }, [chars.length, dispatch, letterEasiness, newCharCount]);

  return (
    <Layout flex l2>
      <PlayContainer navigation={navigation} />
    </Layout>
  );
};

export default PlayScreen;
