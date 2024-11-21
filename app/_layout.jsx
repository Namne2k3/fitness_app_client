
import { ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { tokenCache } from '../libs/clerk';
import socket from '../utils/socket'
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [fontsLoaded, error] = useFonts({
    // "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    // "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    // "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    // "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    // "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    // "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    // "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    // "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    // "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),



    "Roboto-Thin": require('../assets/fonts/Roboto-Thin.ttf'),
    "Roboto-Bold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-ExtraBold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Light": require('../assets/fonts/Roboto-Light.ttf'),
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
    "Roboto-Regular": require('../assets/fonts/Roboto-Regular.ttf'),
    "Roboto-SemiBold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Black": require('../assets/fonts/Roboto-Black.ttf'),


    //     pthin: ["Roboto-Thin"],
    //     plight: ["Roboto-Light"],
    //     pregular: ["Roboto-Regular"],
    //     pmedium: ["Roboto-Medium"],
    //     psemibold: ["Roboto-Bold"],
    //     pbold: ["Roboto-Bold"],
    //     pextrabold: ["Roboto-Bold"],
    //     pblack: ["Roboto-Black"],
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
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar style={colorScheme == 'light' ? 'dark' : 'light'} />
      <GestureHandlerRootView>

        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false, headerTitle: "", }} />
          <Stack.Screen name="(root)" options={{ headerShown: false, headerTitle: "", }} />
        </Stack>

      </GestureHandlerRootView>
    </ClerkProvider>

  );
}
