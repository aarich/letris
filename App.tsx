import { CustomSchemaType } from '@eva-design/dss';
import * as eva from '@eva-design/eva';
import {
  RobotoMono_400Regular,
  useFonts,
} from '@expo-google-fonts/roboto-mono';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './assets/theme.json';
import mapping from './src/components/base/mapping.json';
import Navigation from './src/navigation';
import { persistor, store } from './src/redux/store';
import { useIsDark } from './src/utils/hooks';
import AlertProvider from './src/utils/providers/AlertProvider';
import PromptProvider from './src/utils/providers/PromptProvider';
import ToastProvider from './src/utils/providers/ToastProvider';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// @ts-expect-error partial mappings allowed
const customMapping = mapping as CustomSchemaType;
SplashScreen.preventAutoHideAsync();

export default function App() {
  const isDark = useIsDark();
  const [fontsLoaded] = useFonts({
    RobotoMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
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
            <GestureHandlerRootView style={{ flex: 1 }}>
              <AlertProvider>
                <PromptProvider>
                  <ToastProvider>
                    <Navigation />
                  </ToastProvider>
                </PromptProvider>
              </AlertProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
