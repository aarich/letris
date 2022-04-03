import { Divider, List, Toggle } from '@ui-kitten/components';
import { ComponentProps, FC, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEasinessLevel } from '../../redux/selectors';
import { IconType, Spacings } from '../../utils';
import {
  Button,
  ButtonGroupPicker,
  DropdownPicker,
  Label,
  ListItem,
  PickerOption,
  PickerProps,
  Text,
  View,
} from '../base';

type ListInfo = {
  icon: IconType;
  title: string;
  description?: string;
  type: 'boolean' | 'select' | 'button' | 'header';
};

export type BooleanSettingProp = {
  onToggle: VoidFunction;
  state: boolean;
  type: 'boolean';
} & ListInfo;

export type SelectSettingProp<T> = {
  options: PickerOption<T>[];
  value: T;
  onSelect: (selected: T) => void;
  btns?: boolean;
  type: 'select';
} & ListInfo;

export type ButtonProp = {
  label: string;
  onPress: VoidFunction;
  disabled: boolean;
  type: 'button';
} & ListInfo;

export type HeaderProp = {
  title: string;
  icon?: never;
  description?: never;
  type: 'header';
};

type SettingProp =
  | BooleanSettingProp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | SelectSettingProp<any>
  | ButtonProp
  | HeaderProp;

type Props = {
  settings: SettingProp[];
};

const Settings = ({ settings }: Props) => {
  const paddingBottom = useSafeAreaInsets().bottom;
  const easiness = useEasinessLevel();
  const renderItem = (item: SettingProp): ReactElement => {
    const { title, icon, description } = item;
    const props: ComponentProps<typeof ListItem> = { title, icon, description };
    switch (item.type) {
      case 'header':
        return (
          <>
            <ListItem
              title={() => (
                <Text category="h5" style={styles.header}>
                  {item.title}
                </Text>
              )}
              chevronOverride={false}
              disabled
            />
            <Divider />
          </>
        );
      case 'boolean':
        props.accessoryRight = () => (
          <Toggle checked={item.state} onChange={item.onToggle} />
        );
        break;
      case 'select': {
        const Picker: FC<PickerProps<typeof item.value>> = item.btns
          ? ButtonGroupPicker
          : DropdownPicker;

        const style = item.btns
          ? undefined
          : { flex: item.options[0].label.length === 1 ? 0.4 : 0.7 };
        props.accessoryRight = () => (
          <View style={style}>
            <Picker
              options={item.options}
              selectedValue={item.value}
              onValueChange={item.onSelect}
            />
          </View>
        );
        break;
      }
      case 'button':
        props.accessoryRight = () => (
          <Button
            label={item.label}
            disabled={item.disabled}
            onPress={item.onPress}
            size="tiny"
          />
        );
    }
    return (
      <>
        <ListItem disabled {...props} descriptionNumberOfLines={3} />
        <Divider />
      </>
    );
  };
  return (
    <List
      showsVerticalScrollIndicator={false}
      data={settings}
      contentContainerStyle={{ paddingBottom }}
      keyExtractor={(item) => (typeof item === 'string' ? item : item.title)}
      renderItem={({ item }) => renderItem(item)}
      ListFooterComponent={
        <Label
          label={`Difficulty Level: ${easiness}`}
          category="h6"
          style={styles.difficulty}
          tooltip="Made up and does not correlate with fun-ness!"
        />
      }
    />
  );
};

export default Settings;

const styles = StyleSheet.create({
  difficulty: { padding: Spacings.s3 },
  header: { paddingHorizontal: Spacings.s2 },
});
