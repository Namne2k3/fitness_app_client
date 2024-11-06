import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import React from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const BlogCard = ({ blog }) => {
    const { content, author, media } = blog;

    return (
        <View className="border-b border-gray-300 pb-4 mb-4">
            {/* header */}
            <View className="flex flex-row justify-between items-center px-2">
                <TouchableOpacity onPress={() => { }} className="mr-3">
                    <Image
                        source={{ uri: author?.image }}
                        className="w-10 h-10 rounded-full"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="font-semibold text-sm">{author.name}</Text>
                    <Text className="text-gray-400 text-xs">11/11/2024</Text>
                </View>
            </View>

            {/* body */}
            <View className="flex flex-col">
                {/* content */}
                <View className="p-2">
                    <Text className="text-sm font-plight">{content}</Text>
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
                        {media?.map((med, index) => (
                            <View key={index}>
                                {
                                    med.type == 'image' ?
                                        <TouchableOpacity className="w-full h-[350px]">
                                            <Image
                                                source={{ uri: med.url }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                        :
                                        <Video
                                            source={{ uri: med.url }}
                                            className="w-full h-full"
                                            resizeMode="contain"
                                            useNativeControls
                                        />
                                }
                            </View>
                        ))}
                    </Swiper>
                </View>
            </View>

            {/* footer */}
            <View className="flex flex-row mt-3 px-2">
                <TouchableOpacity onPress={() => { }} >
                    <AntDesign name='like2' size={28} color={'#000'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { }} className="ml-4">
                    <MaterialCommunityIcons name='comment-text-outline' size={28} color={'#000'} />
                </TouchableOpacity>
            </View>
        </View>
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
