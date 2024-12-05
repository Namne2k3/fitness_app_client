import { Image } from 'expo-image'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SetCard from './SetCard'

const NoNeedKg = [
    'bóng bosu',
    'bóng tập thằng bằng',
    'bóng y tế',
    'búa',
    'con lăn',
    'con lăn bánh xe',
    'dây kháng lực',
    'dây thừng',
    'lốp xe',
    'máy leo cầu thang',
    'máy tập elip',
    'máy tập smith',
    'máy tập thân trên',
    'máy tập trượt tuyết (skierg)',
    'máy tập đòn bẩy',
    'trọng lượng cơ thể',
    'xe đạp tập cố định'
]

const TrainingCard = ({ item: { exercise, sets }, handleUpdateIsCheck, handleUpdateKilogramAndReps, hasCheck, toggleBottomSheetModal }) => {

    const isNeedKg = !NoNeedKg.includes(exercise?.equipment)

    return (
        <View className="bg-[#fff] flex justify-center items-center dark:bg-slate-800">
            <View className="flex flex-row justify-between items-center">
                <View>
                    <TouchableOpacity onPress={() => toggleBottomSheetModal(exercise)}>
                        <Image
                            source={{
                                uri: exercise.gifUrl
                            }}
                            className="w-[70px] h-[70px] mr-2"
                            contentFit="contain"
                        />
                    </TouchableOpacity>
                </View>
                <View className="flex flex-col flex-1 justify-center items-start">
                    <Text className="font-psemibold text-[13px] capitalize dark:text-white">{exercise.name}</Text>
                    <Text className="font-pregular text-[12px] dark:text-white">Số hiệp: {sets?.length}</Text>
                </View>
            </View>

            <View className="w-full mt-2">
                <FlatList
                    data={sets}
                    renderItem={({ item, index }) => (
                        <SetCard isNeedKg={isNeedKg} handleUpdateIsCheck={handleUpdateIsCheck} hasCheck={hasCheck} handleUpdateKilogramAndReps={handleUpdateKilogramAndReps} itemParent={{ exercise, sets }} index={index} item={item} />
                    )}
                    ItemSeparatorComponent={() => (
                        <View className="h-[16px] dark:bg-slate-800" />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default TrainingCard

const styles = StyleSheet.create({})