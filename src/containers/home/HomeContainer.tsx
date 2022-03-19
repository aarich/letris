import Home from '../../components/home/Home';
import { useRows } from '../../redux/selectors';

type Props = { onGoToPlay: VoidFunction; onToggleDrawer: VoidFunction };

const HomeContainer = ({ onGoToPlay, onToggleDrawer }: Props) => {
  const isStarted = useRows().length > 0;
  return (
    <Home
      onGoToPlay={onGoToPlay}
      onToggleDrawer={onToggleDrawer}
      isStarted={isStarted}
    />
  );
};

export default HomeContainer;
