
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '../libs/clerk'
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getUserByEmail } from '@/libs/mongodb';
import { useUserStore } from '@/store';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
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
