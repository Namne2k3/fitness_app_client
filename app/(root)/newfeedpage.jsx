import { ResizeMode, Video } from 'expo-av';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import CustomButton from '../../components/CustomButton';
import LoadingModal from '../../components/LoadingModal';
import { createVideo } from '../../libs/appwrite';
import { createNewFeed } from '../../libs/mongodb';
import useUserStore from '../../store/userStore';
import { analyzeImage } from '../../libs/google_vision_cloud';

const convert = {

}

const NewFeedPage = () => {


    const { isEdit, data } = useLocalSearchParams()

    const [imageLoading, setImageLoading] = useState(false)
    const { colorScheme } = useColorScheme()
    const { user } = useUserStore()
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [form, setForm] = useState(data ? {
        ...JSON.parse(data),
        medias: JSON.parse(data)?.medias?.map((asset) => {
            if (asset.uri) {
                return asset
            } else {
                return {
                    ...asset,
                    type: asset.fileType,
                    uri: asset.uri
                }
            }
        })
    } : {
        content: '',
        author: user?._id,
        medias: [],
        likes: [],
        comments: [],
        allowComment: true
    })

    const openPicker = async () => {
        try {
            setForm((prev) => ({ ...prev, medias: [] }))
            setImageLoading(true)
            let result = await launchImageLibraryAsync({
                mediaTypes: 'Images',
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
                    const isSafeContent = analysisResult.responses.every((response, index) => {
                        const safeSearch = response.safeSearchAnnotation;
                        console.log(`Image ${index + 1}:`);

                        console.log(`- Adult: ${safeSearch.adult}`);
                        console.log(`- Spoof: ${safeSearch.spoof}`);
                        console.log(`- Medical: ${safeSearch.medical}`);
                        console.log(`- Violence: ${safeSearch.violence}`);
                        console.log(`- Racy: ${safeSearch.racy}`);

                        if (
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.adult) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.violence)
                            // || ["LIKELY", "VERY_LIKELY"].includes(safeSearch.racy)
                        ) {
                            Alert.alert(`Ảnh thứ ${index + 1} có nội dung không thích hợp.`)
                            return false
                        } else {
                            return true
                        }

                    });
                    if (isSafeContent) {
                        setForm((prev) => ({ ...prev, medias: result.assets ?? [] }))
                    }
                }
                else {
                    throw new Error("Lỗi khi kiểm duyệt hình ảnh")
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
            return;
        } finally {
            setImageLoading(false)
        }
    }

    const handleAddFeed = async () => {
        setIsVisibleModal(true)
        try {
            if (form?.content == "") {
                throw new Error("Bạn cần nhập nội dung")
            }
            const response = await createVideo(form);
            setForm((previous) => ({
                ...previous,
                medias: response
            }))

            if (response) {
                await createNewFeed({
                    ...form,
                    medias: response
                })
            }

            Alert.alert("Đăng thành công!")
            router.back()
        } catch (error) {
            Alert.alert('Lỗi', error.message);
        } finally {
            setIsVisibleModal(false)
        }
    };

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView className="flex bg-[#fff] h-full dark:bg-slate-950 p-4">
            <View className="flex-1">
                <View className="">
                    <Text className="font-pbold text-[16px]">
                        {
                            isEdit == "true" ? 'Cập nhật bài đăng' : 'Bài đăng mới'
                        }
                    </Text>
                    <TextInput
                        multiline
                        placeholder='Nội dung bài đăng'
                        onChangeText={(text) => setForm({ ...form, content: text })}
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            borderWidth: 0.5,
                            borderRadius: 12,
                            marginTop: 12,
                        }}
                        value={isEdit && form?.content}
                    />
                </View>
                <View className="mt-4 flex-1 border-[#ccc] rounded-lg">
                    {
                        form?.medias?.length > 0 ?
                            <Swiper
                                showsPagination={true}
                                loop={false}
                                height={350}
                                paginationStyle={styles.paginationStyle} // Custom style for pagination
                                dotStyle={styles.dotStyle} // Style for inactive dots
                                activeDotStyle={styles.activeDotStyle} // Style for active dot
                            >
                                {
                                    form?.medias?.map((asset, index) => (
                                        <View key={index}>
                                            {
                                                asset.type == 'image/jpeg' || 'image' ?
                                                    <Image
                                                        source={{ uri: asset.uri }}
                                                        className="w-full h-full rounded-lg"
                                                        contentFit="cover"
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

                                    ))
                                }
                            </Swiper>
                            :
                            imageLoading &&
                            <View className="flex flex-1 justify-center items-center">
                                <ActivityIndicator color={'#000'} size={'large'} />
                            </View>
                    }
                </View>
            </View>

            <View className="flex mt-2 flex-[1]">
                <TouchableOpacity onPress={openPicker}>
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
            <LoadingModal visible={isVisibleModal} />
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