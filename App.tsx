import { CustomSchemaType } from '@eva-design/dss';
import * as eva from '@eva-design/eva';
import {
  RobotoMono_400Regular,
  useFonts,
} from '@expo-google-fonts/roboto-mono';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from 'sentry-expo';
import theme from './assets/theme.json';
import mapping from './src/components/base/mapping.json';
import Navigation from './src/navigation';
import { persistor, store } from './src/redux/store';
import { useIsDark } from './src/utils/hooks';
import AlertProvider from './src/utils/providers/AlertProvider';
import PromptProvider from './src/utils/providers/PromptProvider';
import ToastProvider from './src/utils/providers/ToastProvider';

Sentry.init({
  dsn: 'https://4f9bf513e433407aa0d017425f74f0b1@o583200.ingest.sentry.io/6273976',
  enableInExpoDevelopment: false,
  debug: __DEV__,
  normalizeDepth: 5,
});

// @ts-expect-error partial mappings allowed
const customMapping = mapping as CustomSchemaType;

export default function App() {
  const isDark = useIsDark();
  const [fontsLoaded] = useFonts({
    RobotoMono_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ApplicationProvider
          {...eva}
          theme={{ ...(isDark ? eva.dark : eva.light), ...theme }}
          customMapping={customMapping}
        >
          <SafeAreaProvider>
            <AlertProvider>
              <PromptProvider>
                <ToastProvider>
                  <Navigation />
                </ToastProvider>
              </PromptProvider>
            </AlertProvider>
          </SafeAreaProvider>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
