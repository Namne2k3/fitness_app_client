import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BlogCard from '../../../components/BlogCard';
import { images } from '../../../constants/image';
import { deleteBlogById, getAllBlog, updateBlogById, } from '../../../libs/mongodb';
import useUserStore from '../../../store/userStore';
import { deleteFile } from '../../../libs/appwrite';

const Feed = () => {
    const { colorScheme } = useColorScheme()
    const { user } = useUserStore()
    const [blogs, setBlogs] = useState([])
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [smallLoading, setSmallLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBlogs(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    const fetchBlogs = async (isSearchReset = false) => {
        try {
            if (isSearchReset) {
                setSkip(0);
            } else {
                setSmallLoading(true)
            }
            const res = await getAllBlog({ limit, skip: isSearchReset ? 0 : skip })

            if (isSearchReset) {
                setBlogs(res.data)
            } else {
                setBlogs((blogs) => ([
                    ...blogs,
                    ...res.data
                ]))
            }

            if (res?.data?.length > 0) {
                setSkip((prevSkip) => prevSkip + limit);
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setSmallLoading(false)
        }
    }

    const handleDeleteMedias = async (medias) => {
        medias.map(async (item) => {
            await deleteFile(item.$id)
        })
    }

    const handleDeleteBlogById = async (blogId) => {
        try {
            const blogDelete = blogs.find(item => item._id == blogId)
            await handleDeleteMedias(blogDelete?.medias)
            const res = await deleteBlogById(blogId)
            setBlogs((blogs) => blogs.filter((blog) => blog._id != blogId))

            if (res.status === 200) {
                Alert.alert("Đã xóa bài đăng")
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message);
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
            Alert.alert("Lỗi", error.message);
        }
    }, [user?._id]);


    useEffect(() => {
        fetchBlogs(true);
    }, [])

    return (
        <SafeAreaView className="flex h-full pt-4 dark:bg-slate-950">
            <View className="pb-2 flex flex-row justify-between items-center px-4 border-[#ccc]">
                <Text className="dark:text-white font-pextrabold text-[32px] text-center uppercase">bảng tin</Text>
                <View className="flex flex-row">
                    <TouchableOpacity className="mb-1 px-1" onPress={() => router.push(`/(root)/feedprofile/${user?._id}`)}>
                        <AntDesign name='user' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity className="mb-1 px-1" onPress={() => router.push('/(root)/Chat')}>
                        <FontAwesome5 name='facebook-messenger' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity className="mb-1 px-1" onPress={() => router.push('/(root)/newfeedpage')}>
                        <AntDesign name='plus' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                </View>
            </View>


            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={blogs}
                renderItem={({ item, index }) => {
                    return (
                        <BlogCard handleDeleteBlogById={(blogId) => handleDeleteBlogById(blogId)} isAuthor={item?.author?._id == user?._id} colorScheme={colorScheme} userId={user?._id} index={index} handleLike={(blogId) => handleLike(blogId)} blog={item} />
                    )
                }}
                ItemSeparatorComponent={
                    <View className="border-t-[0.5px] border-[#ccc]">

                    </View>
                }
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View className="px-4">
                        {
                            !smallLoading ?
                                <TouchableOpacity className="mb-2 p-1 rounded-lg flex justify-center items-center bg-[#f5f5f5]" onPress={() => fetchBlogs(false)}>
                                    <Text className="text-center">Tải thêm</Text>
                                </TouchableOpacity>
                                // <TouchableOpacity className='mb-4 flex flex-row justify-center items-center' onPress={() => fetchBlogs(false)}>
                                //     <Ionicons name='reload' size={30} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                // </TouchableOpacity>
                                :
                                <ActivityIndicator size={'large'} animating={smallLoading} style={{ marginTop: 12 }} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        }
                    </View>
                }
                ListEmptyComponent={
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
            />


        </SafeAreaView>
    )
}

export default Feed
