import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import useUserStore from '../../store/userStore'

const ChooseGoal = () => {
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const [selected, setSelected] = useState("")

    const handleNext = async () => {
        try {
            if (!selected) {
                throw new Error("Bạn phải điền đầy đủ thông tin!")
            }

            setUser({
                ...user,
                healthGoal: selected
            })

            router.push('/(root)/ChooseFocusBodyPart')
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    return (
        <SafeAreaView className="flex flex-col flex-1 mt-4 h-full bg-[#fff]">
            <View>
                <Text className="font-pbold text-[28px] text-center">Mục tiêu của bạn là gì?</Text>
            </View>

            <View className="flex px-4">
                <View className="h-[100px]"></View>
                <TouchableOpacity onPress={() => setSelected("Tăng cơ")} className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tăng cơ' && 'border-[2px] border-[#000]'}`}>
                    <View className="flex flex-row justify-start items-center">
                        <MaterialCommunityIcons name='arm-flex-outline' size={45} />
                        <Text className="flex-1 ml-4 font-pextrabold text-lg">Tăng cơ</Text>
                        {
                            selected == 'Tăng cơ' && <AntDesign name={'checkcircle'} size={28} />
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Cân đối tổng thể")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Cân đối tổng thể' && 'border-[2px] border-[#000]'}`}>
                    <Ionicons name='fitness-outline' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Cân đối</Text>
                    {
                        selected == 'Cân đối tổng thể' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Sức mạnh")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Sức mạnh' && 'border-[2px] border-[#000]'} `}>
                    <MaterialCommunityIcons name='weight-lifter' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Sức mạnh</Text>
                    {
                        selected == 'Sức mạnh' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Giảm mỡ")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Giảm mỡ' && 'border-[2px] border-[#000]'}`}>
                    <Ionicons name='trending-down' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Giảm mỡ</Text>
                    {
                        selected == 'Giảm mỡ' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 m-4 ">
                <CustomButton bgColor='bg-[#3749db]' onPress={handleNext} text="Tiếp theo" textStyle={{
                    fontFamily: "Roboto-Bold"
                }} />
            </View>
        </SafeAreaView>
    )
}

export default ChooseGoal