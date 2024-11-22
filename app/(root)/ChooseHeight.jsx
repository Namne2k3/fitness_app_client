import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '../../components/InputField'
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import useUserStore from '../../store/userStore'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'

const ChooseHeight = () => {

    const user = useUserStore.getState().user
    const setUser = useUserStore.getState().setUser

    const [level, setLevel] = useState("người mới bắt đầu")

    const handleSetWeightHeight = async (value, type) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            Alert.alert("Lỗi", "Vui lòng nhập số hợp lệ");
            return;
        }

        if (type === "height") {
            setUser({
                ...user,
                height: numericValue.toString(),
                weight: user.weight,
            });
        } else {
            setUser({
                ...user,
                height: user.height,
                weight: numericValue.toString(),
            });
        }
    };


    const handleNext = () => {
        try {

            if (!user.height || !user.weight || isNaN(user.height) || isNaN(user.weight)) {
                Alert.alert("Lỗi", "Chiều cao hoặc cân nặng không hợp lệ!");
                return;
            }

            setUser({
                ...user,
                level: level
            })

            router.push('/(root)/ChooseOrm')
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    return (
        <SafeAreaView className="flex flex-col flex-1 mt-4 h-full bg-[#fff]">
            <View className="px-4 py-2">
                <Text className="font-pbold text-[28px] text-center">Chiều cao và cân nặng của bạn?</Text>
            </View>
            {/* <View className="h-[50px]"></View> */}
            <View className="px-4">
                <InputField
                    onChange={(text) => handleSetWeightHeight(text, "weight")}
                    keyboardType="numeric"
                    placeholder="Cân nặng (kg)"
                    icon={<Ionicons name="body" size={24} style={{ marginLeft: 12 }} />}
                    textRight={'Kg'}
                />
                <InputField
                    onChange={(text) => handleSetWeightHeight(text, "height")}
                    keyboardType="numeric"
                    placeholder="Chiều cao (cm)"
                    icon={<MaterialCommunityIcons name="human-male-height" size={24} style={{ marginLeft: 12 }} />}
                    textRight={'Cm'}
                />
            </View>
            <View className="px-4 mt-4">
                <Text className="font-pbold text-[28px] text-center mb-4">Trình độ của bạn?</Text>

                <TouchableOpacity
                    onPress={() => setLevel("người mới bắt đầu")}
                    className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${level == 'người mới bắt đầu' && 'border-[4px] border-[#000]'}`}
                >
                    <View className="flex flex-row justify-center items-center">
                        <FontAwesome name='battery-1' size={28} />
                    </View>
                    <View className="flex flex-1 ml-4 ">
                        <Text className="font-pextrabold text-lg">Người mới bắt đầu</Text>
                        <Text>Luyện tập ít hơn 6 tháng</Text>
                    </View>
                    {
                        level == 'người mới bắt đầu' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setLevel("trung cấp")}
                    className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${level == 'trung cấp' && 'border-[4px] border-[#000]'}`}
                >
                    <View className="flex flex-row justify-center items-center">
                        <FontAwesome name='battery-2' size={28} />
                    </View>
                    <View className="flex flex-1 ml-4 mr-2">
                        <Text className="font-pextrabold text-lg">Trung cấp</Text>
                        <Text>Luyện tập hơn 6 tháng và ít hơn 2 năm</Text>
                    </View>
                    {
                        level == 'trung cấp' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setLevel("thâm niên")}
                    className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${level == 'thâm niên' && 'border-[4px] border-[#000]'}`}
                >
                    <View className="flex flex-row justify-center items-center">
                        <FontAwesome name='battery-4' size={28} />
                    </View>
                    <View className="flex flex-1 ml-4">
                        <Text className="font-pextrabold text-lg">Thâm niên</Text>
                        <Text>Hơn 2 năm luyện tập</Text>
                    </View>
                    {
                        level == 'thâm niên' && <AntDesign name={'checkcircle'} size={28} />
                    }
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 m-4">
                <CustomButton text="Tiếp theo" onPress={handleNext} textStyle={{
                    fontFamily: "Roboto-Bold"
                }} />
            </View>
        </SafeAreaView>
    )
}

export default ChooseHeight

const styles = StyleSheet.create({})