import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { launchImageLibraryAsync } from 'expo-image-picker'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ImageModal from '../../../components/ImageModal'
import MessageComponent from '../../../components/MessageComponent'
import { createVideo } from '../../../libs/appwrite'
import { analyzeImage } from '../../../libs/google_vision_cloud'
import { createMessage, getAllMessagesByRoomId, getRoomById } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import socket from '../../../utils/socket'
import { downloadAsync, documentDirectory } from 'expo-file-system';
import { saveToLibraryAsync } from 'expo-media-library';

const sendNotification = async (expoPushToken, message) => {
    console.log("Check message >>> ", message);

    const notificationBody = {
        to: expoPushToken,
        sound: 'default',
        title: message?.sender?.username,
        body: message?.content,
        data: {
            url: `/(root)/chatroom/${message.roomId}`
        }
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationBody),
    });
};

const ChatRoom = () => {

    const { colorScheme } = useColorScheme()
    const [smallChooseMediasLoading, setSmallChooseMediasLoading] = useState(false)
    const { id, roomName, roomImage } = useLocalSearchParams()
    const { user } = useUserStore()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const flatListMessages = useRef(null);
    const [smallLoading, setSmallLoading] = useState(false)
    const [smallIsDownload, setSmallIsDownload] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchMore, setIsFetchMore] = useState(false)
    const [skip, setSkip] = useState(0);
    const limit = 10;
    const [room, setRoom] = useState({})
    const [selectedImage, setSelectedImage] = useState({})
    const [visibleImageModal, setVisibleImageModal] = useState(false)
    const [isAtBottomList, setIsAtBottomList] = useState(false);

    const [form, setForm] = useState({
        author: user?._id,
        medias: []
    })

    const handleDownloadImage = async () => {
        setSmallIsDownload(true)
        try {
            const uri = selectedImage?.fileUrl;

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

    const openModal = (img) => {
        setSelectedImage(img)
        setVisibleImageModal(true)
    }

    const closeModal = () => {
        setVisibleImageModal(false);
        setSelectedImage(null);
    };

    const handleSendMessage = async () => {
        setSmallLoading(true);
        try {
            if (message !== "" || form?.medias?.length > 0) {
                let mediasRes = [];
                if (form?.medias?.length > 0) {
                    const response = await createVideo(form);
                    mediasRes = response;
                    setForm((form) => ({
                        ...form,
                        medias: response
                    }));
                }

                const newMessage = await createMessage({
                    roomId: id,
                    sender: user?._id,
                    content: message,
                    medias: mediasRes?.length > 0 ? mediasRes : []
                });

                // Thêm tin nhắn phía người gửi
                if (newMessage && newMessage.data) {
                    setMessages((prevMessages) => ([...prevMessages, newMessage.data]));

                    // Reset lại các trường
                    setMessage("");
                    setForm((form) => ({
                        ...form,
                        medias: []
                    }));

                    socket.emit('sendMessage', newMessage.data);

                    setTimeout(() => flatListMessages.current?.scrollToEnd({ animated: true }), 0);

                    await sendNotification(room?.members[0]?._id == user?._id
                        ? room?.members[1]?.pushToken
                        : room?.members[0]?.pushToken,
                        newMessage.data
                    );

                }
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setSmallLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (!isFetching) {
            setIsFetchMore(true)
            await fetchAllMessageByRoomId();
            setIsFetchMore(false)
        }
    };

    const fetchAllMessageByRoomId = async () => {
        try {
            setIsFetching(true);
            const res = await getAllMessagesByRoomId(id, { limit, skip });

            if (res.status == '404') {
                console.log("Lỗi 404");
                return;
            }

            // load ra tin nhắn
            setMessages((prevMessages) => {
                const newMessages = res.data.filter(
                    (newMsg) => !prevMessages.some((msg) => msg._id === newMsg._id)
                );
                return [...newMessages.reverse(), ...prevMessages];
            });
            setSkip((prevSkip) => prevSkip + limit);
        } catch (error) {
            console.log("Không tìm thấy tin nhắn >>> ", error);
        } finally {
            setIsFetching(false);
        }
    };

    const openPicker = async () => {
        try {
            setSmallChooseMediasLoading(true)
            let result = await launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            const base64Images = result?.assets?.map((base64Img) => base64Img.base64)

            if (!result.canceled) {
                const analysisResult = await analyzeImage(base64Images)
                if (analysisResult?.responses) {
                    const isSafeContent = analysisResult.responses.every((response, index) => {
                        const safeSearch = response.safeSearchAnnotation;
                        console.log(`Image ${index + 1}:`);

                        console.log(`- Adult: ${safeSearch.adult}`);
                        console.log(`- Spoof: ${safeSearch.spoof}`);
                        console.log(`- Medical: ${safeSearch.medical}`);
                        console.log(`- Violence: ${safeSearch.violence}`);
                        console.log(`- Racy: ${safeSearch.racy}`);

                        if (
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.adult) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.violence)
                            // || ["LIKELY", "VERY_LIKELY"].includes(safeSearch.racy)
                        ) {
                            Alert.alert(`Ảnh thứ ${index + 1} có nội dung không thích hợp.`)
                            return false
                        } else {
                            return true
                        }

                    });
                    if (isSafeContent) {
                        setForm((prev) => ({ ...prev, medias: result.assets ?? [] }))
                    }
                }
                else {
                    throw new Error("Lỗi khi kiểm duyệt hình ảnh")
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setSmallChooseMediasLoading(false)
        }
    }

    const handleDeleteChooseImage = (index) => {
        try {
            setForm((form) => ({
                ...form,
                medias: form.medias.filter((item, i) => i != index)
            }))
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    const handleScroll = (event) => {
        setIsAtBottomList(false)
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 100; // Kiểm tra cuộn tới cuối (dư 20px)

        if (isAtBottom) {
            setIsAtBottomList(true)
        }
    };


    useEffect(() => {
        const fetchRoomById = async () => {
            try {
                const room = await getRoomById(id)
                setRoom(room.data);

            } catch (error) {
                Alert.alert("Lỗi", error.message)
            }
        }

        fetchRoomById()
    }, [])

    useEffect(() => {

        fetchAllMessageByRoomId()
        setTimeout(() => flatListMessages.current?.scrollToEnd({ animated: true }), 0); // Đảm bảo cuộn sau khi render
        return () => {
            setForm((form) => ({
                ...form,
                medias: []
            }))
        }
    }, [])


    useEffect(() => {
        socket.emit('joinRoom', id);
        socket.on("newMessage", async (message) => {
            if (message.sender._id != user._id) {
                console.log("Đã nhận tin nhắn phía room của " + user.username);
                setMessages((prevMessages) => [...prevMessages, message]);
            }
            setMessage("");
        });
    }, []);

    return (
        <SafeAreaView className="bg-[#fff] flex dark:bg-slate-950 h-full">
            <View className="flex flex-row justify-between items-center px-4 pt-4 border-b-[0.5px]">
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
                    <Text className="font-pextrabold text-[24px] dark:text-white">{roomName}</Text>
                </View>
                <View className="flex-1" />
            </View>

            <View className="flex flex-1">
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => (
                        <MessageComponent openModal={(img) => openModal(img)} index={index} roomImage={roomImage} item={item} user={user} />
                    )}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    refreshing={isFetching}
                    ListHeaderComponent={
                        isFetchMore
                            ?
                            <ActivityIndicator size='small' />
                            : <TouchableOpacity className="mb-2 p-1 rounded-lg flex justify-center items-center bg-[#f5f5f5]" onPress={() => handleLoadMore()}>
                                <Text className="text-center">Tải thêm</Text>
                            </TouchableOpacity>

                    }
                    showsVerticalScrollIndicator={false}
                    ref={flatListMessages}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: 12
                    }}
                />
            </View>

            <View>
                {
                    form?.medias?.length > 0 &&
                    <ScrollView horizontal className="p-4 pb-2 border-[0.5px] border-[#ccc]">
                        {

                            form?.medias?.map((asset, index) => {
                                return (
                                    <View key={`${asset?.uri}_${index}`} className="relative mr-4">
                                        <View className="">
                                            <Image
                                                source={{
                                                    uri: asset.uri
                                                }}
                                                className="mr-2 rounded-md"
                                                width={80}
                                                height={80}
                                                contentFit='cover'
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleDeleteChooseImage(index)} className='absolute rounded-full left-[-10px] top-[-10px]'>
                                            <AntDesign name='closecircle' size={20} color={'#000'} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                }
                <View className="max-h-[75px] flex flex-row justify-center items-center px-4">
                    {
                        smallChooseMediasLoading
                            ?
                            <ActivityIndicator color={"#000"} size={'small'} />
                            :
                            <TouchableOpacity onPress={openPicker}>
                                <AntDesign name='pluscircleo' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} style={{ paddingRight: 4 }} />
                            </TouchableOpacity>
                    }
                    <View className="p-2 flex-1">
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-[85%]">
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <TextInput
                                    placeholder={"Nhập tin nhắn"}
                                    value={message}
                                    onChangeText={(text) => {
                                        setMessage(text)
                                    }}
                                    onFocus={() => {
                                        if (isAtBottomList) {
                                            console.log("Scroll to end");
                                            setTimeout(() => flatListMessages.current?.scrollToEnd({ animated: true }), 500);
                                        }
                                    }}
                                    onBlur={() => {

                                    }}
                                    placeholderTextColor={colorScheme == 'dark' ? '#6b7280' : '#ccc'}
                                    className="dark:text-white"
                                    multiline
                                />
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </View>
                    <TouchableOpacity onPress={handleSendMessage} className="p-4 pr-0">
                        {
                            smallLoading ?
                                <ActivityIndicator color={'#000'} size={'small'} />
                                :
                                <Ionicons name='send-outline' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {visibleImageModal && (
                <ImageModal smallIsDownload={smallIsDownload} handleDownloadImage={handleDownloadImage} visibleImageModal={visibleImageModal} closeModal={closeModal} selectedImage={selectedImage} />
            )}
        </SafeAreaView>
    )
}

export default ChatRoom
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    image: {
        width: '90%', // Hoặc một giá trị cụ thể
        height: '90%', // Hoặc một giá trị cụ thể
        maxHeight: '80%', // Giới hạn chiều cao tối đa
        maxWidth: '80%', // Giới hạn chiều rộng tối đa
    },
});