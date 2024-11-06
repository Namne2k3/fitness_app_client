import { SafeAreaViewDimensions, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';

const NewFeedPage = () => {
    const { colorScheme } = useColorScheme()

    const [assets, setAssets] = useState([])
    const [isAllowComment, setIsAllowComment] = useState(true)
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
                    />
                    <View className="h-[350px] mt-4">
                        <Swiper
                            showsButtons={false}
                            showsPagination={true}
                        >
                            {assets?.map((asset, index) => (

                                <Image
                                    key={index}
                                    source={{ uri: asset.uri }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />

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
        </SafeAreaView>
    )
}

export default NewFeedPage

const styles = StyleSheet.create({})