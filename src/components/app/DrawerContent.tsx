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
  style?: StyleProp<ViewStyle>;
};

const UPDATES = 'Updates';

type MenuItem = {
  icon: IconType;
  title?: string;
  dest: keyof RootStackParamList | typeof UPDATES;
  rightIcon?: IconType;
};

const items: MenuItem[] = [
  { icon: IconsOutlined.barChart, dest: 'Stats' },
  { icon: IconsOutlined.book, dest: 'Help' },
  { icon: IconsOutlined.settings, dest: 'Settings' },

  { icon: IconsOutlined.info, dest: 'About' },
  { icon: IconsOutlined.bulb, dest: 'Feedback' },
  { icon: IconsOutlined.twitter, dest: UPDATES },
];

const more: MenuItem[] = [];

export function DrawerContent({ onGoToScreen, onToggleDrawer, style }: Props) {
  const onPressItem = (dest: MenuItem['dest']) => {
    switch (dest) {
      case UPDATES:
        openTwitter();
        break;
      default:
        onToggleDrawer();
        onGoToScreen(dest);
        break;
    }
  };

  const renderItem = ({
    icon,
    dest,
    title = dest,
    rightIcon,
  }: MenuItem): ReactElement<MenuItemProps> => (
    <DrawerItem
      key={icon}
      accessoryLeft={(props) => <Icon name={icon} {...props} />}
      title={title}
      onPress={() => onPressItem(dest)}
      accessoryRight={
        rightIcon ? (props) => <Icon name={rightIcon} {...props} /> : undefined
      }
    />
  );

  const drawerItems = [
    ...items.map(renderItem),
    ...(more.length
      ? [
          <DrawerGroup
            key="more"
            title="More"
            accessoryLeft={(props) => (
              <Icon name={IconsOutlined.menu} {...props} />
            )}
          >
            {more.map(renderItem)}
          </DrawerGroup>,
        ]
      : []),
  ];

  return <Drawer style={style}>{drawerItems}</Drawer>;
}
