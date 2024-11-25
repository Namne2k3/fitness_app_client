import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const PlanCard = ({ item, isActive, active, handleNavigateDetail, index }) => {
    return (
        <TouchableOpacity
            onPress={() => handleNavigateDetail(item?._id, index)}
            className={`bg-[#fff] rounded-lg ${isActive && 'bg-[#3749db]'} flex flex-row justify-between p-4`}
        >
            <View className="flex">
                <Text className={`text-black font-pextrabold text-lg ${isActive && 'text-white'}`}>
                    {item?.title}
                </Text>
                <Text className={`text-black font-pmedium text-md ${isActive && 'text-white'}`}>
                    {item?.name}
                </Text>
            </View>

            {
                active < index ?
                    <View className="flex justify-center items-center px-2">
                        <MaterialIcons name='lock-outline' size={28} color={'#000'} />
                    </View>
                    :
                    isActive ?
                        <View className="px-6 py-4 bg-[#fff] rounded-lg">
                            <Text className="text-[#3749db] font-pextrabold text-md">Start</Text>
                        </View>
                        :
                        <View className="flex justify-center items-center px-2">
                            <AntDesign name='checkcircle' size={28} color={'#3749db'} />
                        </View>

            }
        </TouchableOpacity>
    );
};

export default memo(PlanCard); // Bao bọc với React.memo
