import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { getAbbreviation, randomColor } from '../utils/index'
const CalendarCard = ({ item, handleDeleteNotification }) => {

    return (
        <View className="p-4 mr-3 rounded-lg bg-[#f2f2f2] flex flex-col justify-between items-start">
            <View className="flex flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="font-pextrabold text-lg text-[#3749db]">{new Date(item?.calendarDate).toLocaleDateString()}</Text>
                    <Text className="font-pmedium text-[#3749db]">{new Date(item?.calendarDate).toLocaleTimeString()}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleDeleteNotification(item)}
                    className="border-[0.2px] rounded-lg px-4 py-2">
                    <Text>Hủy</Text>
                </TouchableOpacity>
            </View>

            <View className="mt-2 flex flex-row justify-center items-center">
                <View>
                    <Text className="font-pextrabold text-[24px] ">{item?.training?.title}</Text>
                    {
                        item?.planName &&
                        <Text className="font-pextrabold text-[16px] capitalize">{item?.planName}</Text>
                    }
                </View>
                <View className={`ml-4 rounded-full w-[40px] h-[40px] flex justify-center items-center `}
                    style={{
                        backgroundColor: randomColor()
                    }}
                >
                    <Text className="text-white font-pextrabold text-[16px]">
                        {getAbbreviation(item?.training?.title)}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default CalendarCard