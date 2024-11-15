import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { formatDateWithMonth, formatTime } from '../utils'
import { Entypo } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { router } from 'expo-router'

const CommentCard = ({ comment, handlePresentModalSheet, setSelectedComment, index, currentUserId, colorScheme }) => {

    const { userId, username, userImage, content, created_at } = comment

    return (
        <>
            <View className="flex flex-col my-2 border-t-[0.2px] border-[#8d8d8d] pt-2">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row justify-center items-start">
                        <TouchableOpacity onPress={() => router.push(`/(root)/user/${userId}`)} className="mr-3 ">
                            <Image
                                source={{ uri: userImage ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                                className="rounded-full"
                                width={30}
                                height={30}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>
                        <View className="">
                            <Text className="font-semibold text-[14px] dark:text-white">{username ?? ""}</Text>
                            <Text className="text-gray-500 text-[10px] ">{`${formatDateWithMonth(created_at)} ${formatTime(created_at)}`}</Text>
                        </View>
                    </View>
                    {
                        currentUserId == userId &&
                        <TouchableOpacity onPress={() => {
                            setSelectedComment({ index: index, ...comment })
                            handlePresentModalSheet()
                        }} className="px-4">
                            <Entypo name='dots-three-vertical' size={18} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    }
                </View>
                <Text className="mt-1 font-plight text-gray-500 italic">{content}</Text>
            </View>
        </>
    )
}

export default CommentCard

const styles = StyleSheet.create({})