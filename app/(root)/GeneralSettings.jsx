import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const GeneralSettings = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme()

    const saveThemeToStorage = async (theme) => {
        try {
            await AsyncStorage.setItem('theme', theme);
            console.log(`Theme saved as ${theme}`);
        } catch (error) {
            console.error('Failed to save theme to storage', error);
        }
    };

    const setLightTheme = async () => {
        if (colorScheme === 'dark') {
            toggleColorScheme();
            await saveThemeToStorage('light');
        }
    };

    const setDarkTheme = async () => {
        if (colorScheme === 'light') {
            toggleColorScheme();
            await saveThemeToStorage('dark');
        }
    };

    return (
        <SafeAreaView className="dark:bg-slate-950 h-full p-4">
            <View className="flex flex-row justify-start items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        backgroundColor: 'transparent',
                        marginRight: 24
                    }}
                >
                    <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? "#fff" : '#000'} />
                </TouchableOpacity>
                <Text className="font-pextrabold text-[24px] dark:text-white">Thiết lập hệ thống</Text>
            </View>

            <View className="bg-[#fff] dark:bg-[#292727] mt-4 rounded-lg flex flex-row justify-between items-center px-4 py-2">
                <Text className="dark:text-white font-psemibold capitalize">Chế độ tối</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#ccc' }}
                    thumbColor={colorScheme == 'dark' ? '#020617' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={colorScheme == 'dark' ? setLightTheme : setDarkTheme}
                    value={colorScheme == 'dark' ? true : false}
                />
            </View>

        </SafeAreaView>
    )
    // inActiveText={'☀️'}
    // activeText={'🌙'}
}

export default GeneralSettings

const styles = StyleSheet.create({})