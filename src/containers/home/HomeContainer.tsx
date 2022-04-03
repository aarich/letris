import Home from '../../components/home/Home';

type Props = { onGoToPlay: VoidFunction; onToggleDrawer: VoidFunction };

const HomeContainer = ({ onGoToPlay, onToggleDrawer }: Props) => {
  return <Home onGoToPlay={onGoToPlay} onToggleDrawer={onToggleDrawer} />;
};

export default HomeContainer;
