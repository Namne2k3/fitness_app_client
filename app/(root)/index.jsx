import { images } from '@/constants/image';
import { getUserById } from '@/libs/mongodb';
import { getToken } from '@/libs/token';
import { useUserStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import socket from '../../utils/socket';

const WelcomePage = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { setUser } = useUserStore()

    useEffect(() => {
        const checkSavedTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme && savedTheme != colorScheme) {
                    toggleColorScheme();
                }
            } catch (error) {
                console.log('Có lỗi khi lấy dữ liệu theme trong storage', error);
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
                    const userData = await getUserById(res.data.user._id);
                    socket.emit('register', userData?.data?._id);
                    setUser(userData?.data);
                    return true;
                } catch (error) {
                    console.log('Có lỗi khi lấy thông tin người dùng:', error.message);
                    return false;
                }
            }

            const fetchSuccess = await fetchUserByToken();

            if (fetchSuccess) {
                const updatedUser = useUserStore.getState().user;

                if (!updatedUser?.weight || !updatedUser?.height || !updatedUser?.orm || !updatedUser?.tdee || !updatedUser?.age) {
                    await AsyncStorage.removeItem('jwt_token');
                    router.replace(`/(auth)/sign-in`);
                } else {
                    router.replace('/(root)/(tabs)/training');
                }
            } else {
                router.replace('/(auth)/sign-in');
            }
        };

        const initializeApp = async () => {
            await checkSavedTheme();
            await runAppStartupTasks();
        };

        initializeApp();
    }, []);



    return (
        <SafeAreaView className="h-full px-8 py-10 flex">
            <View className="flex justify-center items-center">
                <Image
                    source={images.icon}
                    className="w-[300px] h-[300px]"
                    contentFit="contain"
                />
            </View>
            <View className="mt-8 flex justify-center items-center">
                <Text className="font-pbold text-[32px] text-center">Ứng dụng</Text>
                <Text className="font-pextrabold text-[32px] text-[#00008B] text-center mt-2">MyWorkout</Text>
            </View>
        </SafeAreaView>
    );
};

export default WelcomePage;
