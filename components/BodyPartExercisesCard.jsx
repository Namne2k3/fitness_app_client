import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { images } from '../constants/image'
import { Link, router } from 'expo-router'
const BodyPartExercisesCard = ({ item }) => {

    return (
        <TouchableOpacity className="flex bg-[#fff] dark:bg-[#292727]  rounded-2xl p-4 shadow-lg" onPress={() => router.push(`/(root)/TrainingDetails/${item?._id}`)}>
            <View className="flex flex-row justify-between items-center w-full">
                <View className="flex justify-start items-start">
                    <Text className="dark:text-white capitalize text-[24px] font-pextrabold">{item?.title}</Text>
                    <Text className=" dark:text-white font-pregular font-md mt-1">Số bài tập: {item?.exercises?.length}</Text>
                </View>
                <View className="flex justify-center items-center">
                    <Image
                        source={images[item?.title.toLowerCase()]}
                        className="w-[70px] h-[70px] rounded-full border-[0.5px] dark:border-[#ccc]"
                        contentFit='cover'
                    />
                </View>
            </View>

            <View className="mt-4">
                {
                    item?.exercises?.map((ex, index) => {
                        if (index < 3) {
                            return (
                                <View key={`${ex?.name}_${index}`} className="flex flex-row py-1 justify-between items-center">
                                    <Text className="font-pregular capitalize max-w-[80%] dark:text-white">{ex?.exercise?.name}</Text>
                                    <View className="flex-1 flex flex-row justify-end items-center">
                                        <Text className="font-pbold dark:text-white">{ex?.sets?.length} x {ex?.sets[0]?.reps}</Text>
                                    </View>
                                </View>
                            )
                        }
                    })
                }
            </View>
        </TouchableOpacity>
    )
}

export default BodyPartExercisesCard

const styles = StyleSheet.create({})