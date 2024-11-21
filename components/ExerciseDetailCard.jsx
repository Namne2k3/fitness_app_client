import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'

const ExerciseDetailCard = ({ exercise, handlePresentModalSheet, containerStyle }) => {

    return (
        <TouchableOpacity
            onPress={() => {
                handlePresentModalSheet(exercise)
                console.log("Check exercise >>> ", exercise);

            }}
            className={`flex flex-row shadow-2xl bg-[#f4f5f6] rounded-lg ${containerStyle} border-[0.5px] dark:border-[#ccc]`}
        >
            <View>
                <Image
                    source={{
                        uri: exercise.gifUrl
                    }}
                    className="w-[100px] h-[100px] rounded-l-lg"
                    resizeMode="contain"
                />
            </View>

            <View className="flex justify-center items-start p-3 dark:bg-[#292727] flex-1">
                <Text className="font-pextrabold capitalize w-[70%] dark:text-white">{exercise.name}</Text>
                <Text className="font-pmedium capitalize dark:text-white">Mục tiêu: {exercise.target}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ExerciseDetailCard

const styles = StyleSheet.create({})