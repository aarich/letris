import {
  Drawer,
  DrawerGroup,
  DrawerItem,
  MenuItemProps,
} from '@ui-kitten/components';
import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  IconsOutlined,
  IconType,
  openTwitter,
  RootStackParamList,
} from '../../utils';
import { Icon } from '../base';

type Props = {
  onGoToScreen: (name: keyof RootStackParamList) => void;
  onToggleDrawer: VoidFunction;
  onResetApp: VoidFunction;
  style?: StyleProp<ViewStyle>;
};

const RESET = 'Reset App';
const UPDATES = 'Updates';

type MenuItem = {
  icon: IconType;
  title?: string;
  dest: keyof RootStackParamList | typeof RESET | typeof UPDATES;
};

const items: MenuItem[] = [
  { icon: IconsOutlined.barChart, dest: 'Stats' },
  { icon: IconsOutlined.book, dest: 'Help' },
  { icon: IconsOutlined.settings, dest: 'Settings' },
];

const more: MenuItem[] = [
  { icon: IconsOutlined.info, dest: 'About' },
  { icon: IconsOutlined.bulb, dest: 'Feedback' },
  { icon: IconsOutlined.twitter, dest: UPDATES },
  { icon: IconsOutlined.refresh, dest: RESET },
];

export function DrawerContent({
  onGoToScreen,
  onToggleDrawer,
  onResetApp,
  style,
}: Props) {
  const onPressItem = (dest: MenuItem['dest']) => {
    switch (dest) {
      case RESET:
        onToggleDrawer();
        onResetApp();
        break;
      case UPDATES:
        onToggleDrawer();
        openTwitter();
        break;
      default:
        onGoToScreen(dest);
        break;
    }
  };

  const renderItem = ({
    icon,
    dest,
    title = dest,
  }: MenuItem): ReactElement<MenuItemProps> => (
    <DrawerItem
      key={icon}
      accessoryLeft={(props) => <Icon name={icon} {...props} />}
      title={title}
      onPress={() => onPressItem(dest)}
    />
  );

  const drawerItems = [
    ...items.map(renderItem),
    <DrawerGroup
      key="more"
      title="More"
      accessoryLeft={(props) => <Icon name={IconsOutlined.menu} {...props} />}
    >
      {more.map(renderItem)}
    </DrawerGroup>,
  ];

  return <Drawer style={style}>{drawerItems}</Drawer>;
}
