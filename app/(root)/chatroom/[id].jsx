import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MessageComponent from '../../../components/MessageComponent'
import { createMessage, getAllMessagesByRoomId } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import socket from '../../../utils/socket'
const ChatRoom = () => {

    const { colorScheme } = useColorScheme()
    const { id, roomName, roomImage } = useLocalSearchParams()
    const user = useUserStore.getState().user
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const flatListMessages = useRef(null);

    const handleSendMessage = async () => {
        try {
            socket.emit('sendMessage', { roomId: id, senderId: user?._id, content: message })
        } catch (error) {
            Alert.alert("Error", error.message)
        }
    }

    useEffect(() => {
        const fetchAllMessageByRoomId = async () => {
            try {
                const res = await getAllMessagesByRoomId(id)
                setMessages(res.data)
            } catch (error) {
                Alert.alert("Error", error.message)
            }
        }

        fetchAllMessageByRoomId()
        flatListMessages?.current.scrollToEnd()
    }, [])

    useEffect(() => {
        socket.emit('joinRoom', id);

        socket.on("newMessage", async (message) => {
            console.log("Received new message:", message);
            const savedMessage = await createMessage(message)

            console.log("Check savedMessage >>> ", savedMessage);


            setMessages((prevMessages) => [...prevMessages, savedMessage.data]);
            setMessage("")
        });

        return () => {
            socket.emit("leaveRoom", id);
            socket.off("newMessage");
        };
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
                    <Text className="font-plight text-center text-[12px] mt-[-10px]">
                        {
                            console.log("Check socket.auth >>> ", socket.auth)
                        }
                    </Text>
                </View>
                <View className="flex-1" />
            </View>

            {/* List message */}
            <View className="flex flex-1">
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <MessageComponent roomImage={roomImage} item={item} user={user} />
                    )}
                    ref={flatListMessages}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: 12
                    }}
                    onContentSizeChange={() => {
                        flatListMessages?.current.scrollToEnd()
                    }}
                />
            </View>

            {/* input message */}
            <View className="max-h-[75px] flex flex-row justify-center items-center border-t-[0.5px] px-4">
                <TouchableOpacity>
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
                <TouchableOpacity onPress={handleSendMessage}>
                    <Ionicons name='send-outline' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ChatRoom

const styles = StyleSheet.create({})