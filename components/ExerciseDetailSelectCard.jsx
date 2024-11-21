import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const ExerciseDetailSelectCard = ({ exerciseSelections, handleAddExerciseToSelection, exercise, handlePresentModalSheet }) => {

    const selected = exerciseSelections.find((element) => element.id === exercise.id)
    return (
        <TouchableOpacity
            onLongPress={() => handlePresentModalSheet(exercise)}
            onPress={() => handleAddExerciseToSelection(exercise)}
            className="flex flex-row shadow-2xl bg-[#f4f5f6] rounded-lg border-[0.5px]"
        >
            <View className="flex-[0.5] mr-2">
                <Image
                    source={{
                        uri: exercise.gifUrl
                    }}
                    className="w-[100px] h-[100px] rounded-l-lg"
                    resizeMode="contain"
                />
            </View>

            <View className="flex justify-center items-start p-3 flex-[1]">
                <Text className="font-pextrabold capitalize text-[13px]">{exercise.name}</Text>
                <Text className="font-pregular capitalize text-[12px]">Mục tiêu: {exercise.target}</Text>
            </View>

            <View className="flex justify-center items-center p-2">
                {
                    selected ?
                        <AntDesign
                            name='checkcircle'
                            size={20}
                        />
                        :
                        <AntDesign
                            name='checkcircleo'
                            size={20}
                        />
                }
            </View>
        </TouchableOpacity>
    )
}

export default ExerciseDetailSelectCard

const styles = StyleSheet.create({})