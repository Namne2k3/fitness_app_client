import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import useUserStore from '../../../store/userStore'
import { createNewChatRoom, findChatRoom, getUserById, getFeedsByUserId, updateBlogById } from '../../../libs/mongodb'
import LoadingModal from '../../../components/LoadingModal'
import BlogCard from '../../../components/BlogCard'
import { images } from '../../../constants/image'

const FeedProfile = () => {

    const { id } = useLocalSearchParams()
    const [userProfile, setUserProfile] = useState({})
    const [userFeeds, setUserFeeds] = useState([])
    const { colorScheme } = useColorScheme()
    const user = useUserStore.getState().user
    const [isFetching, setIsFetching] = useState(false)
    const [tab, setTab] = useState('information')

    const handleNavigateChatScreen = async () => {
        try {
            const chatRoom = await findChatRoom(user?._id, userProfile?._id)
            router.push({
                pathname: `/(root)/chatroom/${chatRoom?.data?._id}`,
                params: {
                    _id: chatRoom?.data?._id,
                    roomName: userProfile?.username,
                    roomImage: userProfile?.image
                }
            })

        } catch (error) {
            console.log("Error: ", error.message);
            Alert.alert("Error", error.message)
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

            setUserFeeds((previousBlogs) =>
                previousBlogs.map((item) =>
                    item._id === updatedBlog._id ? updatedBlog : item
                )
            );

            await updateBlogById(updatedBlog._id, updatedBlog);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    }, [user?._id]);

    useEffect(() => {
        setIsFetching(true)
        const fetchUserData = async () => {
            try {
                const res = await getUserById(id);
                setUserProfile(res.data)
                setIsFetching(false)
            } catch (error) {
                setIsFetching(false)
                Alert.alert("Error", error.message)
            }
        }
        fetchUserData();
    }, [])

    useEffect(() => {

        const fetchFeedsByUserId = async () => {
            try {

                const res = await getFeedsByUserId(userProfile?._id)
                setUserFeeds(res.data)
            } catch (error) {
                console.log("Error: ", error.message);
                Alert.alert("Error", error.message)
            }
        }

        if (tab == 'feeds') {
            fetchFeedsByUserId()
        }
    }, [tab])

    return (
        <SafeAreaView className="bg-[#fff] flex relative dark:bg-slate-950 p-4 h-full pb-[100px]">
            <View className="flex flex-row justify-between items-center">
                <View className="flex-1">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} style={{ paddingRight: 12, marginRight: 12 }} />
                    </TouchableOpacity>
                </View>
                <View className="flex">
                    <Text className="font-pextrabold text-[24px] dark:text-white">{userProfile?.username}</Text>
                    <Text className="font-plight text-center text-[12px] mt-[-10px]">
                        Offline
                    </Text>
                </View>
                <View className="flex-1" />
            </View>
            <View className="flex items-center justify-center">
                <View className="relative flex justify-center items-center">
                    <Image
                        source={{ uri: userProfile?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                        width={120}
                        height={120}
                        className="rounded-full"
                        resizeMode='cover'
                    />
                </View>
                <View className="flex flex-row p-2 justify-center items-center">
                    <TouchableOpacity onPress={() => setTab('information')} className={
                        colorScheme == 'dark'
                            ? `flex-1 bg-[#000] rounded-full ${tab == 'information' ? 'border-[#fff]' : 'border-[#000]'} border-[1.5px] p-2 mx-2 justify-center items-center`
                            : `flex-1 bg-[#ccc] rounded-full ${tab == 'information' ? 'border-[#000]' : 'border-[#ccc]'} border-[1.5px] p-2 mx-2 justify-center items-center`}>
                        <Text className="font-pregular text-[12px] dark:text-white">Information</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab('feeds')} className={
                        colorScheme == 'dark'
                            ? `flex-1 bg-[#000] rounded-full ${tab == 'feeds' ? 'border-[#fff]' : 'border-[#000]'} border-[1.5px] p-2 mx-2 justify-center items-center`
                            : `flex-1 bg-[#ccc] rounded-full ${tab == 'feeds' ? 'border-[#000]' : 'border-[#ccc]'} border-[1.5px] p-2 mx-2 justify-center items-center`}>
                        <Text className="font-pregular text-[12px] dark:text-white">Feeds</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex border-[0.5px] dark:border-[#ccc] rounded-lg mt-2">
                {
                    tab == 'information'
                        // information
                        ?
                        <View>

                        </View>
                        // feeds
                        :
                        <>
                            <FlatList
                                data={userFeeds}
                                renderItem={({ item, index }) => {
                                    return (
                                        <BlogCard colorScheme={colorScheme} userId={user?._id} index={index} handleLike={(blogId) => handleLike(blogId)} blog={item} />
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
                                        <Text className="text-sm dark:text-white">{userProfile?.username} has not posted yet!</Text>
                                    </View>
                                )}
                                ItemSeparatorComponent={
                                    <View className="h-[1px] bg-[#ccc]">

                                    </View>
                                }
                                contentContainerStyle={{
                                    paddingBottom: 100
                                }}
                            />
                        </>
                }
            </View>
            <LoadingModal visible={isFetching} />
            <View className="absolute bottom-0 right-0 m-6 bg-[#ccc] dark:bg-[#000] p-2 rounded-full">
                <TouchableOpacity onPress={handleNavigateChatScreen}>
                    <FontAwesome5 name='facebook-messenger' size={32} color={colorScheme == 'dark' ? "#fff" : '#000'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default FeedProfile

const styles = StyleSheet.create({})