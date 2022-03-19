import { IconsOutlined, MyConstants } from '../../utils';
import { Button, HeaderButton, Text, View } from '../base';

type Props = {
  onGoToPlay: VoidFunction;
  onToggleDrawer: VoidFunction;
  isStarted: boolean;
};

const Home = ({ onGoToPlay, onToggleDrawer, isStarted }: Props) => {
  return (
    <View flex>
      <View row>
        <HeaderButton icon={IconsOutlined.menu} onPress={onToggleDrawer} />
      </View>
      <View flex center>
        <Text h1 center>
          {MyConstants.manifest?.name}
        </Text>
        <Button onPress={onGoToPlay} label={isStarted ? 'Continue' : 'Play'} />
      </View>
    </View>
  );
};

export default Home;
