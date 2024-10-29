import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { images } from '../constants/image'
import { Link, router } from 'expo-router'
const BodyPartExercisesCard = ({ item }) => {


    return (
        <TouchableOpacity className="flex bg-[#f4f5f6] dark:bg-[#292727] rounded-2xl p-4" onPress={() => router.push(`/(root)/bodypartexercises/${item}`)}>
            <View className="flex flex-row justify-between items-center w-full">
                <View className="flex justify-start items-start">
                    <Text className="dark:text-white capitalize text-lg font-pextrabold">{item}</Text>
                    {/* <Text className=" dark:text-white font-psemibold font-md">5 exercises</Text> */}
                </View>
                <View className="flex justify-center items-center">
                    <Image
                        source={images[`${item}`]}
                        className="w-[70px] h-[70px] rounded-full"
                        resizeMode='cover'
                    />
                </View>
            </View>

            {/* <View className="mt-4 flex">
                <View className="flex justify-between items-center flex-row mb-1">
                    <Text className="font-pmedium">Bench Fly- Dumbbell</Text>
                    <Text className="font-pextrabold">4x8</Text>
                </View>
                <View className="flex justify-between items-center flex-row mb-1">
                    <Text className="font-pmedium">Bench Fly- Dumbbell</Text>
                    <Text className="font-pextrabold">4x8</Text>
                </View>
                <View className="flex justify-between items-center flex-row mb-1">
                    <Text className="font-pmedium">Bench Fly- Dumbbell</Text>
                    <Text className="font-pextrabold">4x8</Text>
                </View>
            </View> */}

            {/* <View className="flex justify-center items-end mt-2">
                <Link
                    href={`/(root)/bodypartexercises/${item}`}
                    className='text-[#00008B] font-pmedium'
                >
                    View All
                </Link>
            </View> */}
        </TouchableOpacity>
    )
}

export default BodyPartExercisesCard

const styles = StyleSheet.create({})