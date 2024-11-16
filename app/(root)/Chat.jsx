import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../../components/BottomSheet";
import ChatComponent from "../../components/ChatComponent";
import LoadingModal from '../../components/LoadingModal';
import { getAllChatRooms } from "../../libs/mongodb";
import styles from "../../utils/styles";

const Chat = () => {

    const { colorScheme } = useColorScheme()
    const [rooms, setRooms] = useState([])
    const [fetching, setFetching] = useState(false)
    const bottomSheetRef = useRef(null)


    const handlePressChatComponent = useCallback((room) => {
        router.push({
            pathname: `/(root)/chatroom/${room?._id}`,
            params: {
                _id: room?._id,
                roomName: room?.roomName,
                roomImage: room?.roomImage
            }
        })
    }, [])

    const openBottomSheet = () => {
        bottomSheetRef?.current?.present()
    }

    useEffect(() => {
        const fetchAllChatRooms = async () => {
            setFetching(true)
            try {
                const res = await getAllChatRooms()
                setRooms(res.data)
            } catch (error) {
                Alert.alert('Error', error.message)
            } finally {
                setFetching(false)
            }
        }

        fetchAllChatRooms()
    }, [])

    return (
        <SafeAreaView className="bg-[#fff] flex dark:bg-slate-950 p-4 h-full pb-[100px]">
            <View className="flex flex-row justify-between items-center mb-4">
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
                <Text className=" text-center font-pextrabold text-[24px] dark:text-white">Chats</Text>
                <TouchableOpacity onPress={openBottomSheet} className="flex flex-row flex-1 justify-end items-center">
                    <Feather name="edit" size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            <View>
                {rooms?.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item, index }) => <ChatComponent index={index} handlePressChatComponent={handlePressChatComponent} item={item} />}
                        keyExtractor={(item) => item._id}
                    />
                ) : (
                    <View style={styles.chatemptyContainer}>
                        <Text style={styles.chatemptyText}>No rooms created!</Text>
                        <Text>Click the icon above to create a Chat room</Text>
                    </View>
                )}
            </View>
            <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['25%', '50%']} />
            <LoadingModal visible={fetching} />
        </SafeAreaView>
    );
};

export default Chat;