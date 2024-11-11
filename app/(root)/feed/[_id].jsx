import { Alert, Image, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, StyleSheet, Button, Text, TextInput, TouchableOpacity, View, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { getBlogById, updateBlogById } from '../../../libs/mongodb'
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { formatDateWithMonth, formatTime } from '../../../utils'
import { Video } from 'expo-av'
import PagerView from 'react-native-pager-view';
import CommentCard from '../../../components/CommentCard'
import BottomSheet from '../../../components/BottomSheet'
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
    const bottomSheetRef = useRef(null)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedComment, setSelectedComment] = useState(null)
    const inputCommentRef = useRef(null)

    const handleDeleteComment = async () => {
        setIsPostingComment(true)

        try {

            const updatedBlogComments = blog?.comments
            updatedBlogComments.splice(selectedComment.index, 1)

            setBlog((previous) => ({
                ...previous,
                comments: updatedBlogComments
            }))

            await updateBlogById(_id, {
                ...blog,
                comments: updatedBlogComments
            })

            bottomSheetRef?.current?.dismiss()
            setIsPostingComment(false)
        } catch (error) {
            setIsPostingComment(false)
            Alert.alert('Error', error.message)
        }
    }

    const handleEditComment = async () => {
        setIsPostingComment(true)
        try {
            setBlog((previous) => ({
                ...previous,
                comments: blog?.comments?.map((cmt, i) => {
                    if (i == selectedComment?.index) {
                        cmt.content = selectedComment?.content
                    }
                    return cmt
                })
            }))

            const updatedFeed = await updateBlogById(_id, {
                ...blog,
                comments: blog?.comments?.map((cmt, i) => {
                    if (i == selectedComment?.index) {
                        cmt.content = selectedComment?.content
                    }
                    return cmt
                })
            })
            setIsPostingComment(false)
        } catch (error) {
            setIsPostingComment(false)
            Alert.alert("Error", error.message)
        }
    }

    const handlePresentModalSheet = useCallback(() => {
        bottomSheetRef?.current?.present()
    })

    const handleSendComment = async () => {
        setIsPostingComment(true)
        try {

            if (!commentContent) {
                throw new Error("Please enter your comment!")
            }

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

            setCommentContent("")

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
                                <View key={index} className="border-[0.5px] rounded-lg m-2">
                                    {
                                        med.type == 'image' ?
                                            <Image
                                                source={{ uri: med.fileUrl }}
                                                className="w-full h-full rounded-lg"
                                                resizeMode="contain"
                                            />
                                            :
                                            <Video
                                                source={{ uri: med.fileUrl }}
                                                className="w-full h-full rounded-lg"
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
                        {
                            blog?.allowComment &&
                            <TouchableOpacity className="ml-4">
                                <MaterialCommunityIcons name='comment-text-outline' size={28} color={'#000'} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>


                {/* comment input */}
                {
                    blog?.allowComment ?
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
                            <View className="ml-2 border-[0.1px] p-2 pr-4 text-md flex-1 flex-row justify-between items-center rounded-lg ">
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-[85%]">
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <TextInput
                                            placeholder={isEdit ? 'Edit your comment here' : 'Enter your comment here'}
                                            value={isEdit ? selectedComment?.content : commentContent}
                                            onChangeText={(text) => {
                                                if (isEdit) {
                                                    setSelectedComment((previous) => ({ ...previous, content: text }))
                                                } else {
                                                    setCommentContent(text)
                                                }
                                            }}
                                            // onEndEditing={() => {
                                            //     setSelectedComment(null)
                                            //     setIsEdit(false)
                                            // }}
                                            multiline
                                            ref={inputCommentRef}
                                        />
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                                {
                                    isEdit
                                        ?
                                        <View className="flex">
                                            <TouchableOpacity onPress={() => {
                                                setSelectedComment(null)
                                                setIsEdit(false)
                                            }}>
                                                <Text className="font-psemibold text-red-400 text-[14px]">Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleEditComment}>
                                                <Text className="font-psemibold text-[#00008B] text-[14px]">Update</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity onPress={handleSendComment} className="w-[10%]">
                                            <Ionicons name='send' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                        :
                        <View className="flex justify-center items-center border-t-[0.5px] border-[#ccc] mx-2 py-2">
                            <Text className="flex-1 font-pregular italic text-gray-400">This feed doesn't allow comment</Text>
                        </View>
                }

                <View className="p-2 flex-1">
                    {
                        blog?.comments?.map((cmt, index) => (
                            <CommentCard currentUserId={user?._id} index={index} setSelectedComment={(cmt) => setSelectedComment(cmt)} handlePresentModalSheet={handlePresentModalSheet} comment={cmt} key={index} />
                        ))
                    }
                </View>
            </ScrollView>
            <LoadingModal visible={isPostingComment} message={"Loading..."} />
            <BottomSheet bottomSheetRef={bottomSheetRef}>
                <View className="flex">
                    <TouchableOpacity onPress={() => {
                        setIsEdit(true)
                        inputCommentRef.current?.focus()
                        bottomSheetRef?.current?.dismiss()
                    }} className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <Feather name='edit-3' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteComment} className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <MaterialCommunityIcons name='delete-alert-outline' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <MaterialIcons name='report-gmailerrorred' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Report</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
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