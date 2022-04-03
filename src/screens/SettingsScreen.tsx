import { useCallback } from 'react';
import SettingsContainer from '../containers/app/SettingsContainer';
import { RootStackScreenProps } from '../utils';

export default ({ navigation }: RootStackScreenProps<'Settings'>) => {
  const onPopToTop = useCallback(() => navigation.popToTop(), [navigation]);
  return <SettingsContainer onPopToTop={onPopToTop} />;
};
