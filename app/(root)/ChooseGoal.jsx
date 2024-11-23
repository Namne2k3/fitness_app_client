import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import useUserStore from '../../store/userStore'
import { router } from 'expo-router'

const ChooseGoal = () => {
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const [selected, setSelected] = useState("")

    const handleNext = async () => {
        try {
            if (!selected) {
                throw new Error("Bạn phải chọn mục tiêu!")
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
                <TouchableOpacity onPress={() => setSelected("Tăng cơ")} className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tăng cơ' && 'border-[4px] border-[#000]'}`}>
                    <View className="flex flex-row justify-start items-center">
                        <MaterialCommunityIcons name='arm-flex-outline' size={45} />
                        <Text className="flex-1 ml-4 font-pextrabold text-lg">Tăng cơ</Text>
                        {
                            selected == 'Tăng cơ' && <AntDesign name={'checkcircle'} size={28} />
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Cân đối tổng thể")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Cân đối tổng thể' && 'border-[4px] border-[#000]'}`}>
                    <MaterialCommunityIcons name='fire' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Cân đối</Text>
                    {
                        selected == 'Cân đối tổng thể' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Sức mạnh")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Sức mạnh' && 'border-[4px] border-[#000]'} `}>
                    <Feather name='smile' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Sức mạnh</Text>
                    {
                        selected == 'Sức mạnh' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("Giảm mỡ")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Giảm mỡ' && 'border-[4px] border-[#000]'}`}>
                    <MaterialCommunityIcons name='clock-time-four-outline' size={45} />
                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Giảm mỡ</Text>
                    {
                        selected == 'Giảm mỡ' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 m-4 ">
                <CustomButton onPress={handleNext} text="Tiếp theo" textStyle={{
                    fontFamily: "Roboto-Bold"
                }} />
            </View>
        </SafeAreaView>
    )
}

export default ChooseGoal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
})