import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const PlanCard = ({ planId, item, index, current, colorScheme }) => {

    return (
        <TouchableOpacity
            onPress={() => {
                if (current < index) {
                    Alert.alert("Bạn cần phải hoàn thành các bài tập trước!")
                } else {
                    router.push({
                        pathname: `/(root)/TrainingDetails/${item?._id}`,
                        params: { index: index, planId: planId, data: JSON.stringify(item) }
                    })
                }
            }}
            className={`bg-[#fff] dark:bg-[#292727] rounded-lg ${current == index && 'bg-[#3749db]'} flex flex-row justify-between p-4`}
        >
            <View className="flex">
                <Text className={`text-black font-pextrabold text-lg ${current == index && 'text-white'} dark:text-white`}>
                    {item?.title}
                </Text>
                <Text className={`text-black font-pmedium text-md ${current == index && 'text-white'} dark:text-white`}>
                    {item?.name}
                </Text>
            </View>

            {
                current == index &&
                <View className="px-6 py-4 bg-[#fff] rounded-lg">
                    <Text className="text-[#3749db] font-pextrabold text-[16px]">Start</Text>
                </View>
            }
            {
                current < index &&
                <View className="flex justify-center items-center px-2">
                    <MaterialIcons name='lock-outline' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </View>
            }
            {
                current > index &&
                <View className="flex justify-center items-center px-2">
                    <AntDesign name='checkcircle' size={28} color={'#3749db'} />
                </View>
            }
        </TouchableOpacity>
    );
};

export default PlanCard; // Bao bọc với React.memo
