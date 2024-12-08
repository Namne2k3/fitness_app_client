import { Text, TouchableOpacity, View, StyleSheet, Pressable, Modal, Alert } from 'react-native';
import { Image } from 'expo-image'
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDateWithMonth, formatTime } from '../utils';
import { router } from 'expo-router';

const BlogCard = ({ handleDeleteBlogById, blog, handleLike, index, userId, colorScheme, isAuthor }) => {

    const videoRef = useRef(null);
    const {
        _id,
        content,
        author,
        medias,
        likes,
        comments,
        created_at,
        updated_at,
        allowComment
    } = blog;
    const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false)

    useEffect(() => {
        return () => {
            videoRef?.current?.pauseAsync()
        }
    }, [likes])


    return (
        <View className=" dark:border-gray-800 mb-4 py-2 m-2 rounded-lg">
            <View className="flex flex-row justify-between items-center px-2">
                <View className="flex flex-row justify-between items-center flex-1">
                    <TouchableOpacity onPress={() => router.push(`/(root)/feedprofile/${author?._id}`)} className="mr-3">
                        <Image
                            source={{ uri: author?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                            className="w-10 h-10 rounded-full"
                            contentFit='cover'
                        />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <TouchableOpacity onPress={() => router.push(`/(root)/feedprofile/${author?._id}`)} className="mr-3">
                            <Text className="font-semibold text-sm dark:text-[#fff]">{author?.username}</Text>
                        </TouchableOpacity>
                        <Text className="text-gray-400 text-xs">{`${formatDateWithMonth(created_at)} ${formatTime(created_at)}`}</Text>
                    </View>
                </View>
                {
                    isAuthor &&
                    <View className="relative">
                        <TouchableOpacity onPress={() => setIsVisibleModalEdit(true)} className="pl-2 py-2">
                            <Entypo name='dots-three-vertical' size={20} />
                        </TouchableOpacity>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isVisibleModalEdit}
                            onRequestClose={() => {
                                setIsVisibleModalEdit(!isVisibleModalEdit);
                            }}
                        >
                            <TouchableOpacity
                                className="flex-1"
                                onPress={() => setIsVisibleModalEdit(false)}
                            />
                            <View className="absolute top-[120px] right-[10px] border-[0.2px] bg-[#fff] dark:bg-slate-950 rounded-lg px-2 mr-1 mt-2">

                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "",
                                            "Bạn có chắc chắn muốn xóa bài đăng này?",
                                            [
                                                {
                                                    text: "Hủy",
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Xóa",
                                                    onPress: async () => {
                                                        await handleDeleteBlogById(_id)
                                                    },
                                                    style: "destructive",
                                                },
                                            ]
                                        );
                                    }}
                                    className='py-3 px-4'
                                >
                                    <Text className="text-left text-[#000] text-[14px] dark:text-white">Xóa</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    className="py-3 px-4"
                                    onPress={() => router.push({
                                        pathname: `/(root)/newfeedpage`,
                                        params: {
                                            data: JSON.stringify(blog),
                                            isEdit: true
                                        }
                                    })}
                                >
                                    <Text className="text-left text-[#000] text-[14px] dark:text-white">Chỉnh sửa</Text>
                                </TouchableOpacity> */}
                            </View>
                        </Modal>
                    </View>

                }
            </View>

            {/* body */}
            <View className="flex flex-col">
                {/* content */}
                <View className="p-2">
                    <Text className="text-sm font-pregular">{content ?? ""}</Text>
                </View>

                {/* media */}
                <View>
                    <Swiper
                        showsPagination={true}
                        loop={false}
                        height={350}
                        paginationStyle={styles.paginationStyle} // Custom style for pagination
                        dotStyle={styles.dotStyle} // Style for inactive dots
                        activeDotStyle={styles.activeDotStyle} // Style for active dot
                    >
                        {medias?.map((med, index) => {

                            return (
                                <View key={index}>
                                    {
                                        med.type == 'image' ?
                                            <Pressable onPress={() => router.push(`/(root)/feed/${_id}`)} className="w-full h-[350px] border-[0.2px] rounded-lg">
                                                <Image
                                                    source={{ uri: med.uri }}
                                                    className="w-full h-full rounded-lg"
                                                    contentFit="cover"
                                                />
                                            </Pressable>
                                            :
                                            <Pressable onPress={() => router.push(`/(root)/feed/${_id}`)} className="w-full h-[350px] border-[0.2px] rounded-lg">
                                                <Video
                                                    ref={videoRef}
                                                    source={{ uri: med.uri }}
                                                    className="w-full h-full"
                                                    resizeMode="contain"
                                                    useNativeControls
                                                />
                                            </Pressable>
                                    }
                                </View>
                            )
                        })}
                    </Swiper>
                </View>
            </View >

            {/* footer */}
            <View View className="flex flex-row mt-3 px-2" >
                <TouchableOpacity className="flex flex-row justify-center items-center" onPress={() => handleLike(blog, index)} >
                    {
                        likes?.includes(userId)
                            ?
                            <AntDesign name='like1' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            :
                            <AntDesign name='like2' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    }
                    {
                        blog?.likes?.length > 0 &&
                        <Text className="ml-1 dark:text-white">
                            {blog?.likes?.length}
                        </Text>
                    }
                </TouchableOpacity>
                {
                    allowComment &&
                    <View className="flex flex-row justify-center items-center">
                        <TouchableOpacity onPress={() => router.push(`/(root)/feed/${_id}`)} className="ml-4">
                            <MaterialCommunityIcons name='comment-text-outline' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                        {
                            blog?.comments?.length > 0 &&
                            <Text className="ml-1 dark:text-white">
                                {blog?.comments?.length}
                            </Text>
                        }
                    </View>
                }
            </View >
        </View >
    );
};
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
export default BlogCard;
