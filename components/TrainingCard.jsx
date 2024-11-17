import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SetCard from './SetCard'

const TrainingCard = ({ item: { exercise, sets }, handleUpdateIsCheck, handleUpdateKilogramAndReps, hasCheck }) => {

    return (
        <View className="bg-[#fff] flex justify-center items-center dark:bg-slate-800">
            <View className="flex flex-row justify-between items-center">
                <View>
                    <TouchableOpacity>
                        <Image
                            source={{
                                uri: exercise.gifUrl
                            }}
                            className="w-[70px] h-[70px] mr-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <View className="flex flex-col flex-1 justify-center items-start">
                    <Text className="font-psemibold text-[13px] capitalize dark:text-white">{exercise.name}</Text>
                    <Text className="font-pregular text-[12px] dark:text-white">Set: {sets?.length}</Text>
                </View>
            </View>

            <View className="w-full mt-2">
                <FlatList
                    data={sets}
                    renderItem={({ item, index }) => (
                        <SetCard handleUpdateIsCheck={handleUpdateIsCheck} hasCheck={hasCheck} handleUpdateKilogramAndReps={handleUpdateKilogramAndReps} itemParent={{ exercise, sets }} index={index} item={item} />
                    )}
                    ItemSeparatorComponent={() => (
                        <View className="bg-[#fff] h-[10px] dark:bg-slate-800" />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default TrainingCard

const styles = StyleSheet.create({})