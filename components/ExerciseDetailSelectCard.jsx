import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const ExerciseDetailSelectCard = ({ colorScheme, exerciseSelections, handleAddExerciseToSelection, exercise, handlePresentModalSheet }) => {

    const selected = exerciseSelections.find((element) => element.id === exercise.id)
    return (
        <TouchableOpacity
            onLongPress={() => handlePresentModalSheet(exercise)}
            onPress={() => handleAddExerciseToSelection(exercise)}
            className="flex flex-row shadow-2xl bg-[#fff] rounded-lg"
        >
            <View className="flex-[0.5] mr-2">
                <Image
                    source={{
                        uri: exercise.gifUrl
                    }}
                    className="w-[100px] h-[100px] rounded-l-lg"
                    contentFit="contain"
                />
            </View>

            <View className="flex justify-center items-start p-3 flex-[1] dark:bg-[#000]">
                <Text className="font-pextrabold capitalize text-[13px] dark:text-white">{exercise.name}</Text>
                <Text className="font-pregular capitalize text-[12px] dark:text-white">Mục tiêu: {exercise.target}</Text>
            </View>

            <View className="flex justify-center items-center p-2 dark:bg-[#000]">
                {
                    selected ?
                        <AntDesign
                            name='checkcircle'
                            size={20}
                            color={colorScheme == 'dark' ? '#fff' : '#000'}
                        />
                        :
                        <AntDesign
                            name='checkcircleo'
                            size={20}
                            color={colorScheme == 'dark' ? '#fff' : '#000'}
                        />
                }
            </View>
        </TouchableOpacity>
    )
}

export default ExerciseDetailSelectCard

const styles = StyleSheet.create({})