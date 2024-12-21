
import { ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { tokenCache } from '../libs/clerk';
import store from '../store/reduxStore'
import { Provider } from 'react-redux'
import { NotificationProvider } from '../context/NotificationContext';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  const { colorScheme } = useColorScheme()
  const [fontsLoaded, error] = useFonts({
    "Roboto-Thin": require('../assets/fonts/Roboto-Thin.ttf'),
    "Roboto-Italic": require('../assets/fonts/Roboto-Italic.ttf'),
    "Roboto-Bold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-ExtraBold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Light": require('../assets/fonts/Roboto-Light.ttf'),
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
    "Roboto-Regular": require('../assets/fonts/Roboto-Regular.ttf'),
    "Roboto-SemiBold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Black": require('../assets/fonts/Roboto-Black.ttf'),
    "Roboto-BoldItalic": require('../assets/fonts/Roboto-BoldItalic.ttf'),
  });


  useEffect(() => {

    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error, colorScheme])

  if (!fontsLoaded && !error) return null;

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }


  return (
    <Provider store={store}>
      <StatusBar style={colorScheme == 'light' ? 'dark' : 'light'} />
      <NotificationProvider>
        <ClerkProvider rkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <GestureHandlerRootView>

            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false, headerTitle: "", }} />
              <Stack.Screen name="(root)" options={{ headerShown: false, headerTitle: "", }} />
            </Stack>

          </GestureHandlerRootView>
        </ClerkProvider>
      </NotificationProvider>
    </Provider>

  );
}
