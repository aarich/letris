import Settings, {
  BooleanSettingProp,
  ButtonProp,
  SelectSettingProp,
} from '../../components/app/Settings';
import { PickerOption } from '../../components/base';
import { reset, resetWalkthrough, setAppSetting } from '../../redux/actions';
import { SettingsState } from '../../redux/reducers/SettingsReducer';
import { useRows, useSettings } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import {
  alert,
  AppSetting,
  FYI_SETTINGS,
  IconsOutlined,
  IconType,
} from '../../utils';
const numberOpts = (arr: number[]) =>
  arr.map((value) => ({ label: `${value}`, value }));

const SettingsContainer = () => {
  const settings = useSettings();
  const dispatch = useAppDispatch();
  const isStarted = useRows().length > 0;

  const hasTrippedAnyFYI = !FYI_SETTINGS.map(
    (s) => settings[s] as boolean
  ).every((b) => !b);

  const saveChange = (
    setting: Parameters<typeof setAppSetting>[0],
    resetsGame = false
  ) => {
    if (resetsGame && isStarted) {
      alert('Are you sure?', 'This will reset your current game', [
        {
          text: 'Reset it',
          style: 'destructive',
          onPress: () => {
            dispatch(setAppSetting(setting));
            dispatch(reset());
          },
        },
      ]);
    } else {
      dispatch(setAppSetting(setting));
    }
  };

  const makeBoolean = (
    setting: AppSetting,
    icon: IconType,
    title: string,
    description?: string
  ): BooleanSettingProp => {
    const state = settings[setting] as boolean;
    const onToggle = () => saveChange({ [setting]: !state });
    return { state, onToggle, icon, title, description, type: 'boolean' };
  };

  const makeSelect = <T extends AppSetting>(
    setting: T,
    options: PickerOption<SettingsState[T]>[],
    icon: IconType,
    title: string,
    description?: string,
    requiresReset = false,
    btns = false
  ): SelectSettingProp<SettingsState[T]> => {
    const type = 'select';
    const value = settings[setting];
    const onSelect = (selected: SettingsState[T]) =>
      saveChange({ [setting]: selected }, requiresReset);
    return { value, options, onSelect, icon, title, description, type, btns };
  };

  const makeButton = (
    label: string,
    onPress: VoidFunction,
    disabled: boolean,
    icon: IconType,
    title: string,
    description?: string
  ): ButtonProp => ({
    label,
    onPress,
    disabled,
    icon,
    title,
    description,
    type: 'button',
  });

  const items = [
    makeBoolean(
      AppSetting.SHOW_GUTTERS,
      IconsOutlined.grid,
      'Wrapped Gutters',
      'Show wrapped characters to the left and right'
    ),
    makeBoolean(
      AppSetting.AUTOMATIC_WORD_FIND,
      IconsOutlined.search,
      'Detect Words',
      'Automatically search for words horizontally and vertically after each drop'
    ),
    makeBoolean(
      AppSetting.ALLOW_DIAGONAL,
      IconsOutlined.expand,
      'Allow Diagonal',
      'Allow connecting characters diagonally'
    ),
    makeBoolean(
      AppSetting.VERTICAL_GRID_LINES,
      IconsOutlined.options,
      'Show Gridlines',
      'Show vertical grid lines'
    ),
    makeBoolean(
      AppSetting.ANIMATIONS_ENABLED,
      IconsOutlined.activity,
      'Animations',
      'Do you like things to move around?'
    ),
    makeSelect(
      AppSetting.ROW_WIDTH,
      numberOpts([5, 6, 7, 8, 9, 10]),
      IconsOutlined.hash,
      'Game Width',
      'Number of characters per row',
      true
    ),
    makeSelect(
      AppSetting.NEW_CHAR_COUNT,
      numberOpts([2, 3, 4]),
      IconsOutlined.download,
      'Incoming Character Width',
      'Size of incoming characters',
      true
    ),
    makeSelect(
      AppSetting.LETTER_EASINESS,
      [
        { label: 'Easy', value: 0 },
        { label: 'Medium', value: 0.5 },
        { label: 'Hard', value: 1 },
      ],
      IconsOutlined.barChart,
      'Letter Difficulty',
      'How closely characters match their real world frequency'
    ),
    makeSelect(
      AppSetting.FONT_SIZE,
      [
        { label: 'Smaller', value: 32 },
        { label: 'Larger', value: 42 },
      ],
      IconsOutlined.text,
      'Font Size',
      undefined,
      false,
      true
    ),
    makeSelect(
      AppSetting.MIN_WORD_LETTER_COUNT,
      [
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ],
      IconsOutlined.book,
      'Word Character Count',
      'Valid words must be at least this many letters'
    ),
    makeButton(
      'Reset',
      () => dispatch(resetWalkthrough()),
      !hasTrippedAnyFYI,
      IconsOutlined.refresh,
      'Reset Walkthrough',
      'Reenable all those handy "FYI" tips'
    ),
    makeButton(
      'Start Over',
      () =>
        alert(
          'Are you sure?',
          "You'll lose all your stats and game progress.",
          [
            {
              text: 'Reset',
              style: 'destructive',
              onPress: () => dispatch(reset()),
            },
          ]
        ),
      false,
      IconsOutlined.trash2,
      'Reset App',
      'Seeing something buggy? Want a fresh start?'
    ),
    makeBoolean(
      AppSetting.SKIA_ENABLED,
      IconsOutlined.bulb,
      'Beta Renderer',
      "Do you like to use things before they're tried and true?"
    ),
  ];

  return <Settings settings={items} />;
};

export default SettingsContainer;
