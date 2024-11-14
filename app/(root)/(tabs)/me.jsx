import { StyleSheet, TouchableOpacity, View, Text, Modal, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '@/store'
import { AntDesign, FontAwesome5, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { createFeedback } from '@/libs/mongodb'
import { useColorScheme } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Me = () => {
    const userData = useUserStore((state) => state.user)
    const packageInfo = require('../../../package.json');
    const [isRated, setIsRated] = useState(false)
    const [rate, setRate] = useState(0)
    const clearUser = useUserStore((state) => state.clearUser)
    const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false)
    const { colorScheme } = useColorScheme()

    const handleRating = useCallback(async () => {
        try {
            if (rate === 0) {
                throw new Error("You haven't rated yet!")
            }

            const data = await createFeedback({
                user: userData?._id,
                content: '',
                rate
            })

            setIsRated(true)
        } catch (error) {
            Alert.alert('Error', error.message || 'An unknown error occurred') // Chuyển đổi đối tượng lỗi thành chuỗi
        }
    })

    const handleLogOut = async () => {
        try {
            await AsyncStorage.removeItem('jwt_token');
            clearUser()
            Alert.alert('Log out successfully!');
            router.replace('/(auth)/sign-in')
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    }

    return (
        <>
            <SafeAreaView className="flex h-full p-4 dark:bg-slate-950">
                <View className="flex flex-row justify-between items-center ">
                    <Text className="font-pextrabold text-[32px] dark:text-white">{userData?.username}</Text>
                    {
                        userData &&
                        <TouchableOpacity className="flex p-3 rounded-t-lg bg-[#fff] dark:bg-[#292727]" onPress={handleLogOut}>
                            <MaterialCommunityIcons name='logout' size={32} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                        </TouchableOpacity>
                    }
                </View>

                <View className="bg-[#fff] rounded-lg p-4 mb-4 dark:bg-[#292727] rounded-tr-[0] shadow-2xl">
                    <Text className="font-pextrabold capitalize text-lg dark:text-white">Settings</Text>
                    <TouchableOpacity
                        className="flex flex-row py-4 mt-2 justify-start  items-center border-[#ccc] border-b-[0.5px]"
                        onPress={() => router.push('/(root)/myprofile')}
                    >
                        <AntDesign color={colorScheme == 'dark' ? '#fff' : "#000"} name='profile' size={24} style={{ marginRight: 12 }} />
                        <Text className="dark:text-white font-psemibold text-md capitalize">My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(root)/GeneralSettings')} className="flex flex-row py-4 mt-2  justify-start items-center border-[#ccc] border-b-[0.5px]">
                        <AntDesign color={colorScheme == 'dark' ? '#fff' : "#000"} name='setting' size={24} style={{ marginRight: 12 }} />
                        <Text className=" dark:text-white font-psemibold text-md capitalize">General Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled className="flex flex-row py-4 mt-2  justify-start items-center border-[#ccc] border-b-[0.5px]">
                        <AntDesign color={colorScheme == 'dark' ? '#fff' : "#9ca3af"} name='earth' size={24} style={{ marginRight: 12 }} />
                        <Text className="text-gray-400 dark:text-white font-psemibold text-md capitalize">Language</Text>
                    </TouchableOpacity>
                </View>
                <View className="bg-[#fff] rounded-lg p-4 dark:bg-[#292727]">
                    <TouchableOpacity onPress={() => setIsVisibleModalEdit(true)} className="flex flex-row py-4 justify-start items-center border-[#ccc] border-b-[0.5px]">
                        <AntDesign color={colorScheme == 'dark' ? '#fff' : "#000"} name='staro' size={24} style={{ marginRight: 12 }} />
                        <Text className="dark:text-white font-psemibold text-md capitalize">Rate Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(root)/FeedBack')} className="flex flex-row py-4 mt-2  justify-start items-center border-[#ccc] border-b-[0.5px]">
                        <Octicons color={colorScheme == 'dark' ? '#fff' : "#000"} name='pencil' size={24} style={{ marginRight: 12 }} />
                        <Text className="dark:text-white font-psemibold text-md capitalize">Feedback</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-center my-2 font-pmedium text-[#878686]">Version {packageInfo.version}</Text>
            </SafeAreaView >
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisibleModalEdit}
                onRequestClose={() => {
                    setIsVisibleModalEdit(!isVisibleModalEdit);
                }}
            >
                <View className="flex-1 justify-center items-center " style={{
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <View className="bg-[#fff] w-[80%] h-[400px] rounded-lg flex justify-between items-center p-5">
                        {
                            !isRated ?
                                (
                                    <>
                                        <View className="flex flex-row justify-between items-start w-full">
                                            <View>
                                                <AntDesign name='close' size={24} color={'#fff'} />
                                            </View>
                                            <FontAwesome5 name="smile-beam" size={100} color="#fccf03" />
                                            <TouchableOpacity onPress={() => setIsVisibleModalEdit(false)}>
                                                <AntDesign name='close' size={24} />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="">
                                            <Text className="text-center font-pmedium">
                                                We are working hard for a better user experience.
                                            </Text>
                                            <Text className="text-center font-pmedium">
                                                We'd greatly appreciate if you can rate us
                                            </Text>
                                        </View>


                                        <View className="flex flex-row justify-between items-center gap-5">
                                            {
                                                [1, 2, 3, 4, 5].map((item, index) => (
                                                    <TouchableOpacity key={index} onPress={() => setRate(item)}>
                                                        {
                                                            rate >= Number(item)
                                                                ?
                                                                <AntDesign name='star' size={30} color={'#fccf03'} />
                                                                :
                                                                <AntDesign name='staro' size={30} color={'#ccc'} />
                                                        }
                                                    </TouchableOpacity>
                                                ))
                                            }

                                        </View>

                                        <View className="w-full">
                                            <CustomButton
                                                text="Rate"
                                                onPress={handleRating}
                                                containerStyle={" mt-2"}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <View className="flex">
                                        <View className="flex flex-row justify-between items-start w-full mb-4">
                                            <View>
                                                <AntDesign name='close' size={24} color={'#fff'} />
                                            </View>
                                            <FontAwesome5 name="smile-beam" size={100} color="#fccf03" />
                                            <TouchableOpacity onPress={() => {
                                                setIsRated(false)
                                                setRate(0)
                                                setIsVisibleModalEdit(false)
                                            }}>
                                                <AntDesign name='close' size={24} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text className="text-center font-pextrabold text-lg mb-4">
                                            Thank you for rating us!
                                        </Text>
                                        <Text className="text-center font-pextrabold text-[16px]">
                                            Your review contributes to improving the quality of the customer experience
                                        </Text>
                                        <Text className="text-center font-pextrabold text-[16px]">
                                            If you want to contribute, please leave feedback. Thank you
                                        </Text>
                                    </View>
                                )
                        }
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default Me

const styles = StyleSheet.create({})

{/* <SignedIn>
                    <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                    <Button onPress={() => {
                        signOut()
                        router.push('/(auth)/sign-in')
                    }} title="Log Out" />
                </SignedIn>
                <SignedOut>
                    <Link href="/(auth)/sign-in">
                        <Text>Sign In</Text>
                    </Link>
                    <Link href="/(auth)/sign-up">
                        <Text>Sign Up</Text>
                    </Link>
                </SignedOut> */}