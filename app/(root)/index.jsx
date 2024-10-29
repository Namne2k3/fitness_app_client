import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants/image'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress';
import axios from 'axios'
import { getUserByEmail } from '@/libs/mongodb'
import { useUserStore } from '@/store'
const WelcomePage = () => {

    const { colorScheme, toggleColorScheme } = useColorScheme()
    const [timing, setTiming] = useState(0)
    const setUser = useUserStore((state) => state.setUser)
    const user = useUserStore((state) => state.user)
    const duration = 2000;
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const checkSavedTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme && savedTheme !== colorScheme) {
                    toggleColorScheme();
                }
            } catch (error) {
                console.error('Failed to retrieve theme from storage', error);
            }
        };

        const fetchUserByToken = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt_token')
                if (token == null) {
                    return false;
                }

                const res = await axios.get(`${process.env.EXPO_PUBLIC_URL_SERVER}/api/user/getCurrentUser`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
                    await AsyncStorage.removeItem('jwt_token')
                    return false
                }

                const data = res.data;
                const { email } = data.user;
                const userData = await getUserByEmail(email);
                setUser(userData);
                return true
            } catch (error) {
                console.error(error.message);
            }
        };

        const runTasks = async () => {
            await checkSavedTheme();
            const fetchSuccess = await fetchUserByToken()


            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                setTiming(progress);

                if (progress > 1.5 && !fetchSuccess) {
                    clearInterval(interval);
                    router.replace('/(auth)/sign-in');
                }

                if (progress > 1.5 && fetchSuccess) {
                    if (!user?.age || !user?.weight || !user?.height && user?.height == "0" || !user?.orm || !user?.tdee) {
                        clearInterval(interval);
                        router.replace(`/(root)/FillInformation/${user?.email}`)
                        return;
                    } else {
                        clearInterval(interval);
                        router.replace('/(root)/(tabs)/training');
                        return;
                    }
                }
            }, 500);
        };

        runTasks();
    }, [])

    return (
        <SafeAreaView className="h-full px-8 py-10 flex">
            <View className="flex justify-center items-center">
                <Image
                    source={images.welcome_image}
                    className="w-[300px] h-[300px] rounded-full"
                    resizeMode="contain"
                />
            </View>
            <View className="mt-8 flex justify-center items-center">
                <Text className="font-pbold text-[32px] text-center">Welcome to</Text>
                <View>
                    <Text className="font-pextrabold text-[32px] text-[#00008B] text-center -mt-4">MyWorkout</Text>
                </View>
            </View>
            <View className="flex justify-center items-center flex-row flex-1">
                <Progress.Bar
                    animationType='timing'
                    progress={timing}
                    unfilledColor='#F0F0F0'
                    color='#00008B'
                    width={screenWidth - 60}
                    height={15}
                />
            </View>
        </SafeAreaView>
    )
}

export default WelcomePage

const styles = StyleSheet.create({})