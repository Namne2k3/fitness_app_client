import { Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { Video, ResizeMode } from 'expo-av';
import useUserStore from '../../store/userStore'
import { createNewFeed, uploadFiles } from '../../libs/mongodb'
import LoadingModal from '../../components/LoadingModal'
import { router } from 'expo-router'
const NewFeedPage = () => {
    const { colorScheme } = useColorScheme()
    const currentUser = useUserStore.getState().user;
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [form, setForm] = useState({
        content: '',
        author: currentUser?._id,
        medias: [],
        likes: [],
        comments: [],
        allowComment: true
    })

    const openPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            Alert.alert('You did not select any image.')
        } else {
            setForm({ ...form, medias: result.assets ?? [] })
        }
    }

    const handleAddFeed = async () => {
        setIsVisibleModal(true)
        try {
            const response = await uploadFiles(form.medias);

            setForm(previous => {
                return {
                    ...previous,
                    medias: response.data
                }
            })

            if (response.data) {
                await createNewFeed({
                    ...form,
                    medias: response.data
                })
            }

            setIsVisibleModal(false)
            Alert.alert("Posted successfully!")
            router.back()
        } catch (error) {
            setIsVisibleModal(false)
            Alert.alert('Error', 'There was an issue uploading your files: ' + error.message);
        }
    };

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView className="flex bg-[#fff] h-full dark:bg-slate-950">
            <View className="flex bg-[#fff] h-full p-4 dark:bg-slate-950">
                <View className="flex-1">
                    <Text className="font-pbold text-[16px]">New Feed</Text>
                    <TextInput
                        multiline
                        placeholder='Share your story here ...'
                        onChangeText={(text) => setForm({ ...form, content: text })}
                    />
                    <View className="mt-4 flex-1">
                        <Swiper
                            showsPagination={true}
                            loop={false}
                            height={350}
                            paginationStyle={styles.paginationStyle} // Custom style for pagination
                            dotStyle={styles.dotStyle} // Style for inactive dots
                            activeDotStyle={styles.activeDotStyle} // Style for active dot
                        >
                            {form?.medias?.map((asset, index) => (
                                <View key={index}>
                                    {
                                        asset.type == 'image' ?
                                            <Image
                                                source={{ uri: asset.uri }}
                                                className="w-full h-full rounded-lg"
                                                resizeMode="cover"
                                            />
                                            :
                                            <Video
                                                source={{ uri: asset.uri }}
                                                className="w-full h-full"
                                                resizeMode={ResizeMode.COVER}
                                                useNativeControls
                                            />
                                    }
                                </View>

                            ))}
                        </Swiper>
                    </View>
                </View>

                <View className="flex mt-2">
                    <TouchableOpacity onPress={() => openPicker()}>
                        {
                            form?.medias?.length == 0 ?
                                <Image
                                    source={{
                                        uri: "https://icons.veryicon.com/png/o/miscellaneous/1em/add-image.png"
                                    }}
                                    width={100}
                                    height={100}
                                    resizeMode="cover"
                                    className="ml-[-7px]"
                                />
                                :
                                <TouchableOpacity onPress={() => openPicker()}>
                                    <Text className="font-pmedium text-[#ccc]">Change Images</Text>
                                </TouchableOpacity>
                        }
                    </TouchableOpacity>
                    <View className="flex mt-4">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="font-psemibold text-[16px]">Allows Comment</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#4040d6' }}
                                thumbColor={colorScheme == 'dark' ? '#020617' : '#f0f0f0'}
                                value={form.allowComment}
                                onValueChange={() => setForm({ ...form, allowComment: !form.allowComment })}
                            />
                        </View>
                        <View className="flex flex-row">
                            <CustomButton
                                text={"Post"}
                                onPress={handleAddFeed}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <LoadingModal visible={isVisibleModal} message={"Posting ... "} />
        </SafeAreaView>
    )
}

export default NewFeedPage

const styles = StyleSheet.create({
    paginationStyle: {
        bottom: 10, // Adjust the position of the pagination
        alignSelf: 'center', // Center the pagination
    },
    dotStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Style for inactive dots
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDotStyle: {
        backgroundColor: 'white', // Style for active dot
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});