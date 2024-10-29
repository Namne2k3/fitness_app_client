import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const ExerciseDetailSelectCard = ({ exerciseSelections, setExerciseSelections, exercise, handlePresentModalSheet }) => {

    const selected = exerciseSelections.find((element) => element.id === exercise.id)
    return (
        <TouchableOpacity
            onPress={() => handlePresentModalSheet(exercise)}
            className="flex flex-row shadow-2xl bg-[#f4f5f6] rounded-lg"
        >
            <View className="flex-[0.5] mr-2">
                <Image
                    source={{
                        uri: exercise.gifUrl
                    }}
                    className="w-[100px] h-[100px] rounded-lg"
                    resizeMode="contain"
                />
            </View>

            <View className="flex justify-center items-start p-3 flex-[1]">
                <Text className="font-pextrabold capitalize text-[13px]">{exercise.name}</Text>
                <Text className="font-pregular capitalize text-[12px]">Target: {exercise.target}</Text>
            </View>

            <TouchableOpacity onPress={() => {
                setExerciseSelections((previous) => [...previous, exercise])
            }} className="flex justify-center items-center p-2">
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
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default ExerciseDetailSelectCard

const styles = StyleSheet.create({})