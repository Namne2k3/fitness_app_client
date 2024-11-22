import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { images } from '../constants/image'
import { Link, router } from 'expo-router'
const BodyPartExercisesCard = ({ item }) => {

    return (
        <TouchableOpacity className="flex bg-[#f4f5f6] dark:bg-[#292727] rounded-2xl p-4" onPress={() => router.push(`/(root)/bodypartexercises/${item?._id}`)}>
            <View className="flex flex-row justify-between items-center w-full">
                <View className="flex justify-start items-start">
                    <Text className="dark:text-white capitalize text-lg font-pextrabold">{item?._id}</Text>
                    <Text className=" dark:text-white font-pmedium font-md">Số bài tập: {item?.count}</Text>
                </View>
                <View className="flex justify-center items-center">
                    <Image
                        source={images[`${item?._id}`]}
                        className="w-[70px] h-[70px] rounded-full"
                        resizeMode='cover'
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default BodyPartExercisesCard

const styles = StyleSheet.create({})