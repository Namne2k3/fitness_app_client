import { Alert, Image, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { getBlogById, updateBlogById } from '../../../libs/mongodb'
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { formatDateWithMonth, formatTime } from '../../../utils'
import { Video } from 'expo-av'
import PagerView from 'react-native-pager-view';
import CommentCard from '../../../components/CommentCard'
import { useColorScheme } from 'nativewind'
import useUserStore from '../../../store/userStore'
import LoadingModal from '../../../components/LoadingModal'
const DetailFeed = () => {

    const { _id } = useLocalSearchParams()
    const [blog, setBlog] = useState({})
    const [commentContent, setCommentContent] = useState("")
    const [isPostingComment, setIsPostingComment] = useState(false)
    const user = useUserStore.getState().user
    const colorScheme = useColorScheme()

    const handleSendComment = async () => {
        setIsPostingComment(true)
        try {
            setBlog((previous) => ({
                ...previous,
                comments: [
                    ...previous.comments,
                    {
                        userId: user?._id,
                        username: user?.username,
                        userImage: user?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg",
                        content: commentContent,
                        created_at: new Date().toString()
                    }
                ]
            }))

            const updatedFeed = await updateBlogById(_id, {
                ...blog,
                comments: [
                    ...blog.comments,
                    {
                        userId: user?._id,
                        username: user?.username,
                        userImage: user?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg",
                        content: commentContent,
                        created_at: new Date().toString()
                    }
                ]
            })

            console.log("Check updatedFeed >>> ", updatedFeed);


            setIsPostingComment(false)
        } catch (error) {
            setIsPostingComment(false)
            Alert.alert("Error", error.message)
        }
    }

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogById(_id);

                setBlog(res.data)
            } catch (error) {
                Alert.alert("Error", error.message)
            }
        }
        fetchBlog()
    }, [])

    return (
        <>
            <ScrollView
                className="bg-[#fff] flex-1"
            >
                {/* header */}
                <View className="border-t-[1px] border-[#ccc] flex flex-row justify-between items-center px-2 pt-4 ">
                    <TouchableOpacity onPress={() => { }} className="mr-3 ">
                        <Image
                            source={{ uri: blog?.author?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                            className="w-10 h-10 rounded-full"
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="font-semibold text-sm">{blog?.author?.username}</Text>
                        <Text className="text-gray-400 text-xs">{`${formatDateWithMonth(blog?.created_at)} ${formatTime(blog?.created_at)}`}</Text>
                    </View>
                </View>

                <View className="flex">
                    <View className="p-2">
                        <Text className="text-sm font-pregular">{blog?.content ?? ""}</Text>
                    </View>
                    <PagerView
                        initialPage={0}
                        style={{
                            height: 350,
                            backgroundColor: '#fff'
                        }}
                    >
                        {blog?.medias?.map((med, index) => {
                            return (
                                <View key={index}>
                                    {
                                        med.type == 'image' ?
                                            <View className="w-full h-[350px] p-2">
                                                <Image
                                                    source={{ uri: med.fileUrl }}
                                                    className="w-full h-full rounded-lg"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            :
                                            <Video
                                                source={{ uri: med.fileUrl }}
                                                className="w-full h-full"
                                                resizeMode="contain"
                                                useNativeControls
                                            />
                                    }
                                </View>
                            )
                        })}
                    </PagerView>
                    <View className="flex flex-row   p-2">
                        <TouchableOpacity onPress={() => { }} >
                            <AntDesign name='like2' size={28} color={'#000'} />
                        </TouchableOpacity>

                        <TouchableOpacity className="ml-4">
                            <MaterialCommunityIcons name='comment-text-outline' size={28} color={'#000'} />
                        </TouchableOpacity>
                    </View>
                </View>


                {/* comment input */}
                <View className="flex flex-row items-center p-2">
                    <View>
                        <Image
                            source={{
                                uri: blog?.author?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg"
                            }}
                            width={35}
                            height={35}
                            resizeMode='contain'
                        />
                    </View>
                    <View className="ml-2 border-[0.1px] p-2 text-md flex-1 flex-row justify-between items-center rounded-lg ">
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-[85%]">
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <TextInput
                                    placeholder='Enter your comment here'
                                    value={commentContent}
                                    onChangeText={(text) => setCommentContent(text)}
                                    multiline
                                />
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                        <TouchableOpacity onPress={handleSendComment} className="w-[10%]">
                            <Ionicons name='send' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="p-2 flex-1">
                    {
                        blog?.comments?.map((cmt, index) => (
                            <CommentCard comment={cmt} key={index} />
                        ))
                    }
                </View>
            </ScrollView>
            <LoadingModal visible={isPostingComment} message={"Loading..."} />
        </>
    )
}

export default DetailFeed

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