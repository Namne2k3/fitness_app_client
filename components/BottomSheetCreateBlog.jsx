import { Dimensions, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useColorScheme } from 'nativewind';
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../components/CustomButton'
import { useState } from 'react';
import GallerySwiper from "react-native-gallery-swiper";
import Swiper from 'react-native-swiper';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


const BottomSheetCreateBlog = ({ bottomSheetCreateBlogRef }) => {

    const { colorScheme } = useColorScheme()
    const [isAllowComment, setIsAllowComment] = useState(true)

    const [assets, setAssets] = useState([])
    const toggleSwitchAllowComment = () => setIsAllowComment(previousState => !previousState);


    const openPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        setAssets(result.assets || assets)
    }

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetCreateBlogRef}
                snapPoints={['95%']}
                // stackBehavior='replace'
                enableDismissOnClose={true}
                onDismiss={() => {
                    setAssets([])
                }}
                handleIndicatorStyle={{
                    backgroundColor: colorScheme == 'dark' ? "#fff" : 'rgb(2,6,23)',
                }}
                handleStyle={{
                    borderColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                    backgroundColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    borderWidth: 0
                }}
                style={{
                    borderRadius: 12,
                    zIndex: 100,
                    backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff'
                }}
            >
                <View className="flex bg-[#fff] h-full p-4 dark:bg-slate-950">
                    <View className="flex-1">
                        <Text className="font-pbold text-[16px]">New Feed</Text>
                        <TextInput
                            multiline
                            placeholder='Share your story here ...'
                        />
                        <View className="h-[350px]">
                            <Swiper
                                showsButtons={true}
                            >
                                {assets?.map((asset, index) => (
                                    <View key={index}>
                                        <Image
                                            source={{ uri: asset.uri }}
                                            className="w-full h-full rounded-lg"
                                            resizeMode="cover"
                                        />
                                    </View>
                                ))}
                            </Swiper>
                        </View>
                    </View>

                    <View className="flex">
                        <TouchableOpacity onPress={() => openPicker()}>
                            {
                                assets?.length == 0 ?
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
                                        <Text>Change Images</Text>
                                    </TouchableOpacity>
                            }
                        </TouchableOpacity>
                        <View className="flex mt-4">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="font-psemibold text-[16px]">Allows Comment</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#4040d6' }}
                                    thumbColor={colorScheme == 'dark' ? '#020617' : '#f0f0f0'}
                                    value={isAllowComment}
                                    onValueChange={toggleSwitchAllowComment}
                                />
                            </View>
                            <View className="flex flex-row">
                                <CustomButton
                                    onPress={() => bottomSheetCreateBlogRef?.current.dismiss()}
                                    containerStyle={`flex-1 mr-[5px] border-[3px] border-[#ccc]`}
                                    bgColor='bg-[#fff]'
                                    text={"Cancel"}
                                    textStyle={{
                                        color: "#c0c0c0"
                                    }}
                                />
                                <CustomButton containerStyle={`flex-1 mr-[5px] border-[3px] border-[#4040d6]`}
                                    text={"Post"}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrap: {
        width: WIDTH,
        height: HEIGHT * 0.25
    },
    wrapDot: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    dotActive: {
        margin: 3,
        color: 'black',
    },
    dot: {
        margin: 3,
        color: "#fff"
    }
})

export default BottomSheetCreateBlog