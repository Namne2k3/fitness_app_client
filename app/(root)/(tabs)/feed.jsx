import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import BlogCard from '../../../components/BlogCard';
import { images } from '../../../constants/image';
import { getAllBlog, updateBlogById, } from '../../../libs/mongodb';
import useUserStore from '../../../store/userStore';

const Feed = () => {
    const { colorScheme } = useColorScheme()
    const user = useUserStore.getState().user
    const [blogs, setBlogs] = useState([])

    const fetchBlogs = async () => {
        try {
            const res = await getAllBlog()
            setBlogs(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = useCallback(async (blog, index) => {
        try {
            const userId = user?._id;
            const updatedBlog = { ...blog };

            if (updatedBlog.likes.includes(userId)) {
                updatedBlog.likes = updatedBlog.likes.filter(id => id !== userId);
            } else {
                updatedBlog.likes.push(userId);
            }

            setBlogs((previousBlogs) =>
                previousBlogs.map((item) =>
                    item._id === updatedBlog._id ? updatedBlog : item
                )
            );

            await updateBlogById(updatedBlog._id, updatedBlog);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    }, [user?._id]);


    useFocusEffect(
        useCallback(() => {
            fetchBlogs();

            // return () => {
            //     setBlogs([]); // Reset dữ liệu blogs
            // };
        }, [])
    );

    return (
        <SafeAreaView className="flex h-full pt-4 dark:bg-slate-950">
            <View className="pb-2 flex flex-row justify-between items-center px-4 border-b-[1px] border-[#ccc]">
                <Text className="dark:text-white font-pextrabold text-[32px] text-center uppercase">bài viết</Text>
                <View className="flex flex-row">
                    <TouchableOpacity className="mb-1 px-1" onPress={() => router.push('/(root)/Chat')}>
                        <FontAwesome5 name='facebook-messenger' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity className="mb-1 px-1" onPress={() => router.push('/(root)/newfeedpage')}>
                        <AntDesign name='plus' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex justify-center items-center">
                {
                    blogs?.length > 0 ?
                        <FlatList
                            data={blogs}
                            renderItem={({ item, index }) => {
                                return (
                                    <BlogCard colorScheme={colorScheme} userId={user?._id} index={index} handleLike={(blogId) => handleLike(blogId)} blog={item} />
                                )
                            }}
                            ItemSeparatorComponent={
                                <View className="h-[5px] bg-[#ccc]">

                                </View>
                            }
                            showsVerticalScrollIndicator={false}

                            contentContainerStyle={{
                                paddingBottom: 100
                            }}
                        />
                        :
                        <View className="flex h-[80%] items-center justify-center bg-transparent px-8">
                            <Image
                                source={images.no_result}
                                className="w-40 h-40"
                                alt="No recent rides found"
                                resizeMethod="contain"
                            />
                            <Text className="text-sm dark:text-white text-center">Chưa có bài viết</Text>
                        </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default Feed
