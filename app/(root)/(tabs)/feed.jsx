import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind'
import { seedBlogs } from '../../../constants/seeds'
import { images } from '../../../constants/image'
import BlogCard from '../../../components/BlogCard';
import { router, useFocusEffect } from 'expo-router';
import { getAllBlog, } from '../../../libs/mongodb'
import { useCallback, useState } from 'react';

const Feed = () => {
    const { colorScheme } = useColorScheme()
    const [blogs, setBlogs] = useState([])
    const fetchBlogs = async () => {
        try {
            const res = await getAllBlog()
            setBlogs(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchBlogs();
        }, [])
    );

    return (
        <SafeAreaView className="flex bg-[#fff] h-full pt-4 dark:bg-slate-950">
            <View className="flex flex-row justify-between items-center px-4 border-b-[1px] border-[#ccc]">
                <View className="">
                    <AntDesign disabled name='plus' size={32} color={colorScheme == 'dark' ? '#000' : '#fff'} />
                </View>
                <Text className="dark:text-white font-pextrabold text-[32px] text-center">Feed</Text>
                <TouchableOpacity className="mb-1" onPress={() => router.push('/(root)/newfeedpage')}>
                    <AntDesign name='plus' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            <View className="flex justify-center items-center mt-4">
                <FlatList
                    data={blogs}
                    renderItem={({ item }) => {
                        return (
                            <BlogCard blog={item} />
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="flex flex-col flex-1 h-full items-center justify-center bg-transparent">
                            <Image
                                source={images.no_result}
                                className="w-40 h-40"
                                alt="No recent rides found"
                                resizeMethod="contain"
                            />
                            <Text className="text-sm">No one has posted yet, be the first to post!</Text>
                        </View>
                    )}
                    contentContainerStyle={{
                        paddingBottom: 100
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default Feed
