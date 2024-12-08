import { AntDesign, Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Video } from 'expo-av'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Image } from 'expo-image'
import PagerView from 'react-native-pager-view'
import BottomSheet from '../../../components/BottomSheet'
import CommentCard from '../../../components/CommentCard'
import LoadingModal from '../../../components/LoadingModal'
import { deleteBlogById, getBlogById, updateBlogById } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import { formatDateWithMonth, formatTime } from '../../../utils'
import ImageModal from '../../../components/ImageModal'
import { downloadAsync, documentDirectory } from 'expo-file-system';
import { saveToLibraryAsync, usePermissions } from 'expo-media-library';
import { deleteFile } from '../../../libs/appwrite'
const DetailFeed = () => {
    const { _id } = useLocalSearchParams()
    const [blog, setBlog] = useState({})
    const [commentContent, setCommentContent] = useState("")
    const [isPostingComment, setIsPostingComment] = useState(false)
    const user = useUserStore.getState().user
    const { colorScheme } = useColorScheme()
    const bottomSheetRef = useRef(null)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedComment, setSelectedComment] = useState(null)
    const inputCommentRef = useRef(null)
    const [visibleImageModal, setVisibleImageModal] = useState(false)
    const [smallIsDownload, setSmallIsDownload] = useState(false)
    const [selectedImage, setSelectedImage] = useState({})
    const [permissionResponse, requestPermission] = usePermissions();
    const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false)
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
                throw new Error("Bạn chưa điền bình luận!")
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

    const handleLike = async (blog) => {
        try {

            if (blog?.likes.includes(user?._id)) {
                let index = blog?.likes.indexOf(user?._id)
                blog?.likes?.splice(index, 1)
                setBlog((previous) => ({
                    ...previous,
                    likes: blog?.likes
                }))
            } else {
                blog?.likes.push(user?._id)
                setBlog((previous) => ({
                    ...previous,
                    likes: blog?.likes
                }))
            }

            await updateBlogById(blog?._id, blog)

        } catch (error) {
            Alert.alert("Error", error.message)
        }
    }

    const openModal = (img) => {
        setSelectedImage(img)
        setVisibleImageModal(true)
    }

    const closeModal = () => {
        setVisibleImageModal(false);
        setSelectedImage(null);
    };

    const handleDownloadImage = async () => {
        setSmallIsDownload(true)

        try {
            if (permissionResponse.status !== 'granted') {
                await requestPermission();
            }
            const uri = selectedImage?.uri;

            if (!uri) {
                Alert.alert('Lỗi', 'Thiếu đường dẫn của ảnh!');
                return;
            }

            // Tạo đường dẫn lưu ảnh
            const fileUri = `${documentDirectory}${selectedImage?.fileName || 'downloaded_image.jpg'}`;

            // Tải ảnh
            const downloadResult = await downloadAsync(uri, fileUri);

            await saveToLibraryAsync(downloadResult.uri);

            if (downloadResult.status === 200) {
                Alert.alert("Thành công", "Ảnh đã lưu vào thư viện ảnh.");
            } else {
                Alert.alert('Tải hình ảnh thất bài', 'Có lỗi xảy ra khi tải xuống ảnh.');
            }
        } catch (error) {
            Alert.alert('Lỗi', error.message || 'Lỗi tải ảnh.');
        } finally {
            setSmallIsDownload(false)
        }
    };

    const handleDeleteMedias = async (medias) => {
        medias.map(async (item) => {
            console.log("Check media $id >>> ", item.$id);

            await deleteFile(item.$id)
        })
    }

    const handleDeleteBlogById = async () => {
        try {
            await handleDeleteMedias(blog?.medias)
            const res = await deleteBlogById(blog?._id)
            if (res.status === 200) {
                router.back()
                Alert.alert("Đã xóa bài đăng")
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        }
    }

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogById(_id);

                setBlog(res.data)
            } catch (error) {
                Alert.alert("Lỗi", error.message)
            }
        }
        fetchBlog()
    }, [])

    return (
        <>
            <ScrollView
                className="bg-[#fff] h-full flex-1 dark:bg-slate-950"
            >
                {/* header */}
                <View className="flex flex-row justify-between items-center flex-1 px-2">

                    <View className="flex flex-row justify-between items-center flex-1">
                        <TouchableOpacity onPress={() => { }} className="mr-3 ">
                            <Image
                                source={{ uri: blog?.author?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                                className="w-10 h-10 rounded-full"
                                contentFit='cover'
                            />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="font-semibold text-sm dark:text-white">{blog?.author?.username}</Text>
                            <Text className="text-gray-400 text-xs">{`${formatDateWithMonth(blog?.created_at)} ${formatTime(blog?.created_at)}`}</Text>
                        </View>
                    </View>

                    {
                        blog?.author?._id == user?._id &&
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
                                                            await handleDeleteBlogById()
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
                                </View>
                            </Modal>
                        </View>

                    }
                </View>

                <View className="flex">
                    <View className="p-2">
                        <Text className="text-sm font-pregular dark:text-white">{blog?.content ?? ""}</Text>
                    </View>
                    <PagerView
                        initialPage={0}
                        style={{
                            height: 350,
                            backgroundColor: colorScheme == 'dark' ? '#020617' : '#fff'
                        }}
                    >
                        {blog?.medias?.map((med, index) => {
                            return (
                                <Pressable onPress={() => openModal(med)} key={index} className="border-[0.5px] rounded-lg m-2">
                                    {
                                        med.type == 'image' ?
                                            <Image
                                                source={{ uri: med.uri }}
                                                className="w-full h-full rounded-lg"
                                                contentFit="contain"
                                            />
                                            :
                                            <Video
                                                source={{ uri: med.uri }}
                                                className="w-full h-full rounded-lg"
                                                resizeMode="contain"
                                                useNativeControls
                                            />
                                    }
                                </Pressable>
                            )
                        })}
                    </PagerView>
                    <View className="flex flex-row   p-2">
                        <TouchableOpacity className="flex flex-row justify-center items-center" onPress={() => handleLike(blog)} >
                            {
                                blog?.likes?.includes(user?._id)
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
                            blog?.allowComment &&
                            <View className="flex flex-row justify-center items-center">
                                <TouchableOpacity onPress={() => inputCommentRef?.current?.focus()} className="ml-4">
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
                                    className="rounded-full"
                                    contentFit='contain'
                                />
                            </View>
                            <View className="ml-2 border-[0.5px] dark:border-[#fff] p-2 pr-4 text-md flex-1 flex-row justify-between items-center rounded-lg ">
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-[85%]">
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <TextInput
                                            placeholder={isEdit ? 'Thay đổi bình luận' : 'Nhập bình luận'}
                                            value={isEdit ? selectedComment?.content : commentContent}
                                            onChangeText={(text) => {
                                                if (isEdit) {
                                                    setSelectedComment((previous) => ({ ...previous, content: text }))
                                                } else {
                                                    setCommentContent(text)
                                                }
                                            }}
                                            placeholderTextColor={colorScheme == 'dark' ? '#6b7280' : '#9ca3af'}
                                            className="dark:text-white"
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

                <View className="p-2 flex flex-1">
                    {
                        blog?.comments?.map((cmt, index) => (
                            <CommentCard colorScheme={colorScheme} currentUserId={user?._id} index={index} setSelectedComment={(cmt) => setSelectedComment(cmt)} handlePresentModalSheet={handlePresentModalSheet} comment={cmt} key={index} />
                        ))
                    }
                </View>

            </ScrollView>
            <LoadingModal visible={isPostingComment} message={"Loading..."} />
            <BottomSheet snapPoints={['40%']} bottomSheetRef={bottomSheetRef}>
                <View className="flex">
                    <TouchableOpacity onPress={() => {
                        setIsEdit(true)
                        inputCommentRef.current?.focus()
                        bottomSheetRef?.current?.dismiss()
                    }} className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <Feather name='edit-3' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            "Xóa bình luận",
                            "Bạn có chắc chắn muốn xóa bình luận này?",
                            [
                                {
                                    text: "Hủy",
                                    style: "cancel",
                                },
                                {
                                    text: "Xóa",
                                    onPress: handleDeleteComment,
                                    style: "destructive",
                                },
                            ]
                        );
                    }} className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <MaterialCommunityIcons name='delete-alert-outline' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <MaterialIcons name='report-gmailerrorred' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Report</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
            {visibleImageModal && (
                <ImageModal smallIsDownload={smallIsDownload} handleDownloadImage={handleDownloadImage} visibleImageModal={visibleImageModal} closeModal={closeModal} selectedImage={selectedImage} />
            )}
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