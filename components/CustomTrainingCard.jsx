import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getAbbreviation, randomColor } from '../utils/index.js'
import { router } from 'expo-router'

const CustomTrainingCard = ({ item }) => {

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(root)/TrainingDetails/${item._id}`)}
            className="flex p-4 bg-[#fff] rounded-lg mb-3 dark:bg-[#292727]"
        >
            <View className="flex flex-row justify-between">
                <View className="flex">
                    <Text className="dark:text-white text-[20px] font-pextrabold">{item.title}</Text>
                    <Text className="dark:text-white font-pbold">
                        {item?.exercises?.length} bài tập
                    </Text>
                </View>
                <View className={`rounded-full w-[40px] h-[40px] flex justify-center items-center `}
                    style={{
                        backgroundColor: randomColor()
                    }}
                >
                    <Text className="text-white font-pextrabold text-[16px];">
                        {getAbbreviation(item?.title)}
                    </Text>
                </View>
            </View>
            <View className="flex mt-4">
                {
                    item?.exercises?.map((ex, index) => (
                        <View key={index} className="flex flex-row justify-between items-start mb-2">
                            <Text className="dark:text-white flex-1 font-pmedium capitalize">{ex?.exercise?.name}</Text>
                            <Text className="dark:text-white flex-[0.4] text-right font-pextrabold">{ex?.sets?.length} Hiệp</Text>
                        </View>
                    ))
                }
            </View>
        </TouchableOpacity>
    )
}

export default CustomTrainingCard

const styles = StyleSheet.create({})