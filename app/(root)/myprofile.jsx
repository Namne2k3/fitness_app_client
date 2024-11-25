import { AntDesign, Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoadingModal from '../../components/LoadingModal'
import { uploadFile } from '../../libs/appwrite'
import { handleUpdateUser } from '../../libs/mongodb'
import useUserStore from '../../store/userStore'

const MyProfile = () => {
    const user = useUserStore.getState().user
    const setUser = useUserStore.getState().setUser
    const { colorScheme } = useColorScheme()
    const [profileImage, setProfileImage] = useState({})
    const [isVisibleModal, setIsVisibleModal] = useState(false)

    const openPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });


        if (result.canceled) {
            Alert.alert('You did not select any image.')
        } else {

            setProfileImage(result.assets[0])
        }
    }

    const handleUpdateUserImage = async () => {
        setIsVisibleModal(true)
        try {
            // upload file image
            const imageUrl = await uploadFile(profileImage, profileImage?.type)
            const updatedUser = await handleUpdateUser({ ...user, image: imageUrl.fileUrl })
            setUser(updatedUser)
            setProfileImage({})

        } catch (error) {
            console.log("Error: ", error.message);
            Alert.alert("Error", error.message)
        } finally {
            setIsVisibleModal(false)
        }
    }

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
                <Text className="ml-4 font-pextrabold text-[28px] dark:text-white">Thông tin của tôi</Text>
            </View>

            <View className="relative flex justify-center items-center mt-4">
                <Image
                    source={{ uri: profileImage?.uri ? profileImage?.uri : user?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                    width={120}
                    height={120}
                    className="rounded-full"
                    contentFit='cover'
                />
                <TouchableOpacity onPress={openPicker} className="absolute">
                    <Feather name='camera' size={24} color={"#000"} />
                </TouchableOpacity>

            </View>
            {
                profileImage?.uri &&
                <View className="flex flex-row mt-2 justify-center items-center">
                    <TouchableOpacity
                        className={
                            colorScheme == 'dark'
                                ? `flex-1 bg-[#000] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                                : `flex-1 bg-[#ccc] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                        }
                        onPress={handleUpdateUserImage}
                    >
                        <Text className="font-pregular text-[12px] dark:text-white">Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={
                            colorScheme == 'dark'
                                ? `flex-1 bg-[#000] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                                : `flex-1 bg-[#ccc] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                        }
                        onPress={() => setProfileImage({})}
                    >
                        <Text className="font-pregular text-[12px] dark:text-white">Cancel</Text>
                    </TouchableOpacity>
                </View>
            }

            <View className="mt-4">
                <TouchableOpacity
                    onPress={() => router.push('/(root)/update1rm')}
                    className="bg-[#fff] dark:bg-[#292727] flex p-4 rounded-lg shadow-xl"
                >
                    <Text className="dark:text-white font-pmedium">ORM (Bench Press)</Text>
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
                    <Text className="font-pregular text-lg dark:text-white">Giới tính</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white capitalize">{user?.gender}</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                    <Text className="font-pregular text-lg dark:text-white">Cân nặng hiện tại</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white">{user?.weight} Kg</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                    <Text className="font-pregular text-lg dark:text-white">Chiều cao</Text>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="text-center font-pextrabold text-lg dark:text-white">{user?.height} cm</Text>
                        <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                </TouchableOpacity>
            </View>
            <LoadingModal visible={isVisibleModal} message={"Loading..."} />
        </SafeAreaView>
    )
}

export default MyProfile

const styles = StyleSheet.create({})