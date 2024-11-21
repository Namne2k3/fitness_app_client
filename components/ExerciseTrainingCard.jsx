import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
const ExerciseTrainingCard = ({ item, onPress }) => {



    return (
        <TouchableOpacity
            onPress={() => onPress(item.exercise)}
            className={`flex flex-row shadow-2xl bg-[#fff] shadow-black-500 dark:bg-[#292727]`}
        >
            <View>
                <Image
                    source={{
                        uri: item.exercise.gifUrl
                    }}
                    className="w-[100px] h-[100px] rounded-lg"
                    resizeMode="contain"
                />
            </View>

            <View className="flex justify-center items-start p-3 flex-1">
                <Text className="font-pextrabold capitalize dark:text-white">{item.exercise.name}</Text>
                <Text className="font-pregular capitalize dark:text-white">Target: {item.exercise.target}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ExerciseTrainingCard

const styles = StyleSheet.create({})