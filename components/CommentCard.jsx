import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { formatDateWithMonth, formatTime } from '../utils'

const CommentCard = ({ comment }) => {
    const { userId, username, userImage, content, created_at } = comment
    return (
        <View className="flex my-2 border-t-[0.2px] border-[#8d8d8d] pt-2">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => { }} className="mr-3 ">
                    <Image
                        source={{ uri: userImage ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                        className="rounded-full"
                        width={30}
                        height={30}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="font-semibold text-[14px]">{username ?? ""}</Text>
                    <Text className="text-gray-500 text-[10px]">{`${formatDateWithMonth(created_at)} ${formatTime(created_at)}`}</Text>
                </View>
            </View>
            <Text className="mt-1 font-plight text-gray-500 italic">{content}</Text>
        </View>
    )
}

export default CommentCard

const styles = StyleSheet.create({})