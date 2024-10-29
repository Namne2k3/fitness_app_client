import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { router } from 'expo-router'
import useUserStore from '../../store/userStore'

const MyProfile = () => {
    const user = useUserStore((state) => state.user)

    const { colorScheme } = useColorScheme()

    useEffect(() => {

    }, [user])

    return (
        <SafeAreaView className="h-full p-4 dark:bg-slate-950">
            <View className="flex flex-row justify-start items-center">
                <TouchableOpacity
                    onPress={() => router.replace('/(root)/me')}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                >
                    <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="ml-4 font-pextrabold text-[28px] dark:text-white">My Profile</Text>
            </View>

            <View className="mt-4">
                <TouchableOpacity
                    onPress={() => router.push('/(root)/update1rm')}
                    className="bg-[#fff] dark:bg-[#292727] flex p-4 rounded-lg shadow-xl"
                >
                    <Text className="dark:text-white font-pmedium">My 1RM (Bench Press)</Text>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className="font-psemibold text-lg capitalize dark:text-white">
                            {user?.orm} kg
                        </Text>
                        <AntDesign size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
            </View>

            <View className="mt-4">
                <Text className="text-[#acaaaa] font-pregular">Basic Info</Text>
                <TouchableOpacity className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                    <Text className="font-pregular text-lg dark:text-white">Gender</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white capitalize">{user?.gender}</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                    <Text className="font-pregular text-lg dark:text-white">Current Weight</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white">{user?.weight} Kg</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                    <Text className="font-pregular text-lg dark:text-white">Height</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white">{user?.height} cm</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MyProfile

const styles = StyleSheet.create({})