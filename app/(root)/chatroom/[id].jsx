import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams, useSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, Platform, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { seedMessages } from '../../../constants/seeds'
import MessageComponent from '../../../components/MessageComponent'
import useUserStore from '../../../store/userStore'
const ChatRoom = () => {

    const { colorScheme } = useColorScheme()
    const { id, roomName, roomImage } = useLocalSearchParams()
    const user = useUserStore.getState().user

    useEffect(() => {

    }, [])

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
                        Offline
                    </Text>
                </View>
                <View className="flex-1" />
            </View>

            {/* List message */}
            <View className="flex flex-1">
                <FlatList
                    data={seedMessages}
                    renderItem={({ item }) => (
                        <MessageComponent roomImage={roomImage} item={item} user={user} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: 12
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

                                onChangeText={(text) => {
                                    console.log(text);

                                }}
                                placeholderTextColor={colorScheme == 'dark' ? '#6b7280' : '#ccc'}
                                className="dark:text-white"
                                multiline
                            />
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
                <TouchableOpacity>
                    <Ionicons name='send-outline' size={24} color={colorScheme == 'dark' ? '#fff' : "#000"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ChatRoom

const styles = StyleSheet.create({})