import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { formatTime, formatDateWithMonth } from '../utils'

const HistoryRecordCard = ({ item }) => {

    return (
        <TouchableOpacity className="bg-[#fff] mb-3 dark:bg-[#292727] p-4 flex rounded-lg" onPress={() => router.push({
            pathname: `/(root)/TrainingDetails/${item?.training?._id}`,
            params: {
                data: JSON.stringify(item?.training)
            }
        })}>
            <View className="flex flex-row justify-between items-center">
                <Text className="dark:text-white text-[16px] font-pextrabold">{item?.training?.title ?? "Set tập không tồn tại"}</Text>
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