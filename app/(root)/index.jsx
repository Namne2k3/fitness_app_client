import { Dimensions, Text, View } from 'react-native';
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/image';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import { getUserByEmail } from '@/libs/mongodb';
import { useUserStore } from '@/store';
import { getToken } from '@/libs/token';

const WelcomePage = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [timing, setTiming] = useState(0);
    const setUser = useUserStore((state) => state.setUser);
    const duration = 2000;
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        let isNotificationHandled = false;

        const handleInitialNotification = async () => {
            const notificationData = await AsyncStorage.getItem('notificationData');
            if (notificationData != null) {
                isNotificationHandled = true
                const parsed = JSON.parse(notificationData)
                if (parsed?._id) {
                    router.push(`/(root)/TrainingDetails/${parsed?._id}`)
                }
            }
            // if (notificationData != null) {
            //     isNotificationHandled = true
            //     const { subtitle } = JSON.parse(notificationData);
            //     if (subtitle) {
            //         console.log("Subtitle from notification:", subtitle);

            //         // Xóa dữ liệu để tránh xử lý lại
            //         await AsyncStorage.removeItem('notificationData');
            //         router.replace(`/(root)/(tabs)/${subtitle}`);
            //         return; // Ngăn chặn khởi động app như bình thường
            //     }
            // }
            await AsyncStorage.removeItem('notificationData');
        };

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
        const runAppStartupTasks = async () => {

            const fetchUserByToken = async () => {
                try {
                    const token = await getToken();
                    if (!token) return false;

                    const res = await axios.get(`${process.env.EXPO_PUBLIC_URL_SERVER}/api/user/getCurrentUser`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.status === 401) {
                        await AsyncStorage.removeItem('jwt_token');
                        return false;
                    }

                    const userData = await getUserByEmail(res.data.user._doc.email);
                    setUser(userData);
                    return true;
                } catch (error) {
                    console.log('Error fetching user:', error.message);
                    return false;
                }
            }

            const fetchSuccess = await fetchUserByToken();

            if (fetchSuccess) {
                if (!isNotificationHandled) {
                    const updatedUser = useUserStore.getState().user;

                    if (!updatedUser?.weight || !updatedUser?.height || !updatedUser?.orm || !updatedUser?.tdee) {
                        router.replace(`/(root)/ChooseGender`);
                    } else {
                        router.replace('/(root)/(tabs)/training');
                    }
                }
            } else {
                router.replace('/(auth)/sign-in');
            }
        };

        const initializeApp = async () => {
            await checkSavedTheme();
            await runAppStartupTasks(); // Chạy logic khởi động nếu không có thông báo
            // await handleInitialNotification(); // Kiểm tra thông báo
            isNotificationHandled = false
        };

        initializeApp();
    }, []);



    return (
        <SafeAreaView className="h-full px-8 py-10 flex">
            <View className="flex justify-center items-center">
                <Image
                    source={images.welcome_image}
                    className="w-[300px] h-[300px] rounded-full"
                    contentFit="contain"
                />
            </View>
            <View className="mt-8 flex justify-center items-center">
                <Text className="font-pbold text-[32px] text-center">Ứng dụng</Text>
                <Text className="font-pextrabold text-[32px] text-[#00008B] text-center mt-2">MyWorkout</Text>
            </View>
            {/* <View className="flex justify-center items-center flex-row flex-1">
                <Progress.Bar
                    animationType="timing"
                    progress={timing}
                    unfilledColor="#F0F0F0"
                    color="#00008B"
                    width={screenWidth - 60}
                    height={15}
                />
            </View> */}
        </SafeAreaView>
    );
};

export default WelcomePage;
