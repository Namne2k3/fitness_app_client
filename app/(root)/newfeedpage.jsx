import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import CustomButton from '../../components/CustomButton';
import LoadingModal from '../../components/LoadingModal';
import { createVideo } from '../../libs/appwrite';
import { createNewFeed } from '../../libs/mongodb';
import useUserStore from '../../store/userStore';
import { analyzeImage } from '../../libs/google_vision_cloud';
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
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            const base64Images = result?.assets?.map((base64Img) => base64Img.base64)

            if (result.canceled) {

            } else {
                const analysisResult = await analyzeImage(base64Images)
                if (analysisResult?.responses) {
                    analysisResult.responses.forEach((response, index) => {
                        const safeSearch = response.safeSearchAnnotation;
                        console.log(`Image ${index + 1}:`);

                        console.log(`- Adult: ${safeSearch.adult}`);
                        console.log(`- Spoof: ${safeSearch.spoof}`);
                        console.log(`- Medical: ${safeSearch.medical}`);
                        console.log(`- Violence: ${safeSearch.violence}`);
                        console.log(`- Racy: ${safeSearch.racy}`);

                        if (
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.adult) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.violence) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.racy)
                        ) {
                            throw new Error(`Ảnh ${index + 1} nội dung không thích hợp.`)
                        } else {
                            setForm({ ...form, medias: result.assets ?? [] })
                        }

                    });
                }
                else {
                    throw new Error("Lỗi khi kiểm duyệt hình ảnh")
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    const handleAddFeed = async () => {
        setIsVisibleModal(true)
        try {
            const response = await createVideo(form);
            setForm(previous => {
                return {
                    ...previous,
                    medias: response
                }
            })

            if (response) {
                await createNewFeed({
                    ...form,
                    medias: response
                })
            }

            Alert.alert("Đăng thành công!")
            router.back()
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsVisibleModal(false)
        }
    };

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView className="flex bg-[#fff] h-full dark:bg-slate-950">
            <View className="flex bg-[#fff] h-full p-4 dark:bg-slate-950">
                <View className="flex-1">
                    <Text className="font-pbold text-[16px]">Bài đăng mới</Text>
                    <TextInput
                        multiline
                        placeholder='Chia sẽ câu chuyện của bạn ...'
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
                                    contentFit="cover"
                                    className="ml-[-7px]"
                                />
                                :
                                <TouchableOpacity onPress={() => openPicker()}>
                                    <Text className="font-pmedium text-[#ccc]">Thay đổi ảnh</Text>
                                </TouchableOpacity>
                        }
                    </TouchableOpacity>
                    <View className="flex mt-4">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="font-psemibold text-[16px]">Cho phép bình luận</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#4040d6' }}
                                thumbColor={colorScheme == 'dark' ? '#020617' : '#f0f0f0'}
                                value={form.allowComment}
                                onValueChange={() => setForm({ ...form, allowComment: !form.allowComment })}
                            />
                        </View>
                        <View className="flex flex-row">
                            <CustomButton
                                text={"Đăng"}
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