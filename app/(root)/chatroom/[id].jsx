import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MessageComponent from '../../../components/MessageComponent'
import { createMessage, getAllMessagesByRoomId } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import socket from '../../../utils/socket'
import { launchImageLibraryAsync } from 'expo-image-picker';
import { analyzeImage } from '../../../libs/google_vision_cloud'
const ChatRoom = () => {

    const { colorScheme } = useColorScheme()
    const { id, roomName, roomImage } = useLocalSearchParams()
    const { user } = useUserStore()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const flatListMessages = useRef(null);
    const [smallLoading, setSmallLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [skip, setSkip] = useState(0);
    const [isFetchMore, setIsFetchMore] = useState(false)
    const limit = 10;
    const [form, setForm] = useState({
        author: user?._id,
        medias: []
    })

    const handleSendMessage = async () => {
        try {
            setSmallLoading(true)
            if (message != "") {
                const newMessage = await createMessage({ roomId: id, senderId: user?._id, content: message })
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, newMessage.data];
                    setTimeout(() => flatListMessages.current?.scrollToEnd({ animated: true }), 0); // Đảm bảo cuộn sau khi render
                    return updatedMessages;
                });
                setMessage("")
                socket.emit('sendMessage', newMessage.data)
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setSmallLoading(false)
        }
    }

    const handleLoadMore = async () => {
        if (!isFetching) {
            setIsFetchMore(true)
            await fetchAllMessageByRoomId();
            setIsFetchMore(false)
        }
    };

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        if (contentOffset.y <= 0 && !isFetching) {
            handleLoadMore();
        }
    };

    const fetchAllMessageByRoomId = async () => {
        try {
            setIsFetching(true);
            const res = await getAllMessagesByRoomId(id, { limit, skip });

            if (res.status == '404') {
                console.log("Gap loi 404");
                return;
            }

            // Loại bỏ tin nhắn trùng lặp
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
            let result = await launchImageLibraryAsync({
                mediaTypes: 'All',
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            const base64Images = result?.assets?.map((base64Img) => base64Img.base64)

            if (result.canceled) {

            } else {
                const analysisResult = await analyzeImage(base64Images)
                if (analysisResult?.responses) {
                    analysisResult.responses.forEach((response, index) => {
                        const safeSearch = response.safeSearchAnnotation;
                        console.log(`Image ${index + 1}:`);

                        console.log(`- Adult: ${safeSearch.adult}`);
                        console.log(`- Spoof: ${safeSearch.spoof}`);
                        console.log(`- Medical: ${safeSearch.medical}`);
                        console.log(`- Violence: ${safeSearch.violence}`);
                        console.log(`- Racy: ${safeSearch.racy}`);

                        if (
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.adult) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.violence) ||
                            ["LIKELY", "VERY_LIKELY"].includes(safeSearch.racy)
                        ) {
                            throw new Error(`Ảnh ${index + 1} nội dung không thích hợp.`)
                        } else {
                            setForm({ ...form, medias: result.assets ?? [] })
                        }

                    });
                }
                else {
                    throw new Error("Lỗi khi kiểm duyệt hình ảnh")
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }


    useEffect(() => {

        fetchAllMessageByRoomId()
    }, [])


    useEffect(() => {
        socket.emit('joinRoom', id);
        socket.on("newMessage", async (message) => {
            console.log("Đã nhận tin nhắn phía room");
            setMessages((prevMessages) => [...prevMessages, message]);
            setMessage("");
            flatListMessages.current.scrollToEnd()
        });
    }, [id]);

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
                    {/* <Text className="font-plight text-center text-[12px] ">
                        Offline
                    </Text> */}
                </View>
                <View className="flex-1" />
            </View>

            <View className="flex flex-1">
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => (
                        <MessageComponent index={index} roomImage={roomImage} item={item} user={user} />
                    )}
                    // onScroll={handleScroll}
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

                    ref={flatListMessages}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: 12
                    }}
                />
            </View>

            {/* input message */}
            <View className="max-h-[75px] flex flex-row justify-center items-center border-t-[0.5px] px-4">
                <TouchableOpacity onPress={openPicker}>
                    <AntDesign name='pluscircleo' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} style={{ paddingRight: 4 }} />
                </TouchableOpacity>
                <View className="p-2 flex-1">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-[85%]">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <TextInput
                                placeholder={"Enter your text"}
                                value={message}
                                onChangeText={(text) => {
                                    setMessage(text)
                                }}
                                placeholderTextColor={colorScheme == 'dark' ? '#6b7280' : '#ccc'}
                                className="dark:text-white"
                                multiline
                            />
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
                <TouchableOpacity onPress={handleSendMessage} className="p-4">
                    {
                        smallLoading ?
                            <ActivityIndicator color={'#000'} size={'small'} />
                            :
                            <Ionicons name='send-outline' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ChatRoom

const styles = StyleSheet.create({})