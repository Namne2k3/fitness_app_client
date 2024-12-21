import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import useUserStore from '../../store/userStore'
import { levelToPointMap } from '../../constants/seeds'
import { BMR, calculateTrainingPlan } from '../../utils/index'

const ChooseTdee = () => {
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const [selected, setSelected] = useState("Hoạt động nhẹ")
    const [form, setForm] = useState({
        level_workout: levelToPointMap[selected],
        bmr: BMR(user),
        tdee: (levelToPointMap[selected] * BMR(user)),
    })

    const handleNext = () => {
        try {

            const { daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            } = calculateTrainingPlan({
                ...user,
                bmr: form.bmr,
                activityLevel: form.level_workout,
                tdee: form.tdee,
            })

            if (daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            ) {
                setUser({
                    ...user,
                    bmr: form.bmr,
                    activityLevel: form.level_workout,
                    tdee: form.tdee,
                    daysShouldTraining: daysShouldTraining,
                    caloriesPerTraining: caloriesPerTraining,
                    totalDaysToReachTarget: totalDaysToReachTarget,
                    proteinRequirement: proteinRequirement,
                    fatRequirement: fatRequirement,
                    mealDistribution: mealDistribution
                })

                router.push('/(root)/ChooseOrm')
            } else {
                throw new Error("Xảy ra lỗi khi tính toán thông số")
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    useEffect(() => {
        setForm((form) => ({
            ...form,
            level_workout: levelToPointMap[selected],
            tdee: (levelToPointMap[selected] * BMR(user))
        }))
    }, [selected])

    return (
        <SafeAreaView className="flex flex-col flex-1 mt-4 h-full bg-[#fff]">
            <View className="px-4 py-2">
                <Text className="font-pbold text-[28px] text-center">Mức độ hoạt động</Text>
            </View>
            <ScrollView>

                <View className="flex px-4">
                    <TouchableOpacity onPress={() => setSelected("Ít vận động")} className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Ít vận động' && 'border-[2px] border-[#000]'}`}>
                        <View className="flex flex-row justify-start items-center">
                            <FontAwesome name='desktop' size={32} color={"#000"} />
                            <Text className="flex-1 mx-4 font-pmedium text-[16px]">Ít vận động (ít hoặc không tập thể dục + làm việc văn phòng)</Text>
                            {
                                selected == 'Ít vận động' && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Hoạt động nhẹ")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Hoạt động nhẹ' && 'border-[2px] border-[#000]'}`}>
                        <MaterialCommunityIcons name='clock-time-four-outline' size={32} color={"#000"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Hoạt động nhẹ (tập thể dục nhẹ 1-3 ngày / tuần)</Text>
                        {
                            selected == 'Hoạt động nhẹ' && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục vừa phải")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục vừa phải' && 'border-[2px] border-[#000]'} `}>
                        <MaterialIcons name='directions-run' size={32} color={"#000"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục vừa phải (tập thể dục vừa phải 3-5 ngày / tuần)</Text>
                        {
                            selected == 'Tập thể dục vừa phải' && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục cường độ cao")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục cường độ cao' && 'border-[2px] border-[#000]'}`}>
                        <MaterialCommunityIcons name='dumbbell' size={32} color={"#000"} />

                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục hàng ngày hoặc tập thể dục cường độ cao 3-4 lần / tuần</Text>
                        {
                            selected == 'Tập thể dục cường độ cao' && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục nặng")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục nặng' && 'border-[2px] border-[#000]'}`}>
                        <MaterialCommunityIcons name='weight-lifter' size={32} color={"#000"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục nặng (tập thể dục nặng 6-7 ngày / tuần)</Text>
                        {
                            selected == 'Tập thể dục nặng' && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục rất căng thẳng")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục rất căng thẳng' && 'border-[2px] border-[#000]'}`}>
                        <MaterialCommunityIcons name='fire' size={32} color={"#000"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục rất căng thẳng hàng ngày hoặc công việc thể chất, nặng nhọc</Text>
                        {
                            selected == "Tập thể dục rất căng thẳng" && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                        }
                    </TouchableOpacity>
                </View>
                <View className="m-4 ">
                    <CustomButton bgColor={`bg-[#3749db]`} onPress={handleNext} text="Tiếp theo" textStyle={{
                        fontFamily: "Roboto-Bold"
                    }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChooseTdee

const styles = StyleSheet.create({})