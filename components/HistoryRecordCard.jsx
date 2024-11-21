import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { formatTime, formatDateWithMonth } from '../utils'

const HistoryRecordCard = ({ item }) => {
    return (
        <TouchableOpacity className="bg-[#fff] dark:bg-[#292727] p-2 flex" onPress={() => router.push(`/(root)/TrainingDetails/${item?.training?._id}`)}>
            <View className="flex flex-row justify-between items-center">
                <Text className="dark:text-white text-[16px] font-pextrabold">{item?.training?.title}</Text>
            </View>
            <View className="flex flex-row mt-2">
                <View className="flex-1">
                    <Text className="dark:text-white font-psemibold">{formatTime(item?.created_at)}</Text>
                    <Text className="text-[#878686] font-psemibold">{formatDateWithMonth(item?.created_at)}</Text>
                </View>

                <View className="flex-1">
                    <Text className=" dark:text-white font-psemibold">{item?.duration}</Text>
                    <Text className="text-[#878686] font-psemibold">Thời lượng</Text>
                </View>

                <View className="flex-1">
                    <Text className=" dark:text-white font-psemibold">{item?.caloriesBurned.toFixed(2)}</Text>
                    <Text className="text-[#878686] font-psemibold">Calo tiêu hao</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default HistoryRecordCard

const styles = StyleSheet.create({})