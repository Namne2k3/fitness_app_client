import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import React, { useEffect } from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDateWithMonth, formatTime } from '../utils';
import { router } from 'expo-router';

const BlogCard = ({ blog, handleLike, index, userId, colorScheme }) => {
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

    useEffect(() => {

    }, [likes])


    return (
        <View className="border-b-[4px] border-gray-300 dark:border-gray-800 pt-4 pb-4 mb-4">
            {/* header */}
            <View className="flex flex-row justify-between items-center px-2">
                <TouchableOpacity onPress={() => { }} className="mr-3">
                    <Image
                        source={{ uri: author?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                        className="w-10 h-10 rounded-full"
                        resizeMode='cover'
                    />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="font-semibold text-sm dark:text-[#fff]">{author?.username}</Text>
                    <Text className="text-gray-400 text-xs">{`${formatDateWithMonth(created_at)} ${formatTime(created_at)}`}</Text>
                </View>
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
                                            <TouchableOpacity onPress={() => router.push(`/(root)/feed/${_id}`)} className="w-full h-[350px] p-2">
                                                <Image
                                                    source={{ uri: med.fileUrl }}
                                                    className="w-full h-full rounded-lg"
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => router.push(`/(root)/feed/${_id}`)} className="w-full h-[350px] p-2">
                                                <Video
                                                    source={{ uri: med.fileUrl }}
                                                    className="w-full h-full"
                                                    resizeMode="contain"
                                                    useNativeControls
                                                />
                                            </TouchableOpacity>
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
