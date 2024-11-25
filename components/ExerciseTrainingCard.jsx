import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
const ExerciseTrainingCard = ({ item, onPress }) => {

    return (
        <>

            <TouchableOpacity
                onPress={() => onPress(item.exercise)}
                className={`flex flex-row shadow-2xl bg-[#fff] rounded-lg dark:border-[#ccc]`}
            // className={`px-4 py-2 flex flex-row shadow-2xl rounded-lg border-[0.5px] bg-[#fff] shadow-black-500 dark:bg-[#292727]`}
            >
                <View>
                    <Image
                        source={{
                            uri: item.exercise.gifUrl
                        }}
                        className="w-[100px] h-[100px] rounded-lg"
                        contentFit="contain"
                    />
                </View>

                <View className="flex justify-center items-start p-3 dark:bg-[#292727] flex-1 rounded-r-lg">
                    <Text className="font-pextrabold capitalize  dark:text-white">{item.exercise.name}</Text>
                    <Text className="font-pmedium capitalize dark:text-white">Mục tiêu: {item.exercise.target}</Text>
                </View>
            </TouchableOpacity>
            {/* <View className="h-[10px] bg-[#f4f5f6] dark:bg-slate-950" /> */}
        </>
    )
}

export default ExerciseTrainingCard

const styles = StyleSheet.create({})