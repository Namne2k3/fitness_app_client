import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useUserStore from '../../store/userStore'
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const levelToPointMap = {
    "Ít vận động": 1.232,
    "Hoạt động nhẹ": 1.411,
    "Tập thể dục vừa phải": 1.504,
    "Tập thể dục cường độ cao": 1.591,
    "Tập thể dục nặng": 1.771,
    "Tập thể dục rất căng thẳng": 1.950
}

function calculateTrainingPlan(userData) {

    const {
        weight,
        targetWeight,
        tdee,
        healthGoal,
        level
    } = userData;

    const adjustedTDEE = tdee;

    let daysShouldTraining = 0;
    if (healthGoal === "Tăng cơ") {
        daysShouldTraining = level === "Người mới bắt đầu" ? 4 : 5;
    } else if (healthGoal === "Giảm mỡ") {
        daysShouldTraining = 5;
    } else if (healthGoal === "Cân đối") {
        daysShouldTraining = 3;
    } else if (healthGoal === "Sức mạnh") {
        daysShouldTraining = 4;
    }


    const minCaloriesPerTraining = Math.floor(adjustedTDEE * 0.10);
    const maxCaloriesPerTraining = Math.floor(adjustedTDEE * 0.20);
    const caloriesPerTraining = (minCaloriesPerTraining + maxCaloriesPerTraining) / 2;

    // Yêu cầu protein và chất béo
    const proteinRequirement = weight * 2; // 2g/kg protein cho tăng cơ
    const fatRequirement = Math.ceil(adjustedTDEE * 0.25); // Chất béo 25% TDEE

    // Tốc độ tăng cân lành mạnh (mặc định: 0.5–1 kg/tuần)
    const calorieSurplusPerDay = 500; // Lượng calo dư mỗi ngày
    const calorieChangePerKg = 7700; // Calo để tăng/giảm 1 kg

    // Tính tổng số ngày để đạt cân nặng mục tiêu
    let totalDaysToReachTarget = 0;
    if (targetWeight > weight) {
        const totalWeightGain = targetWeight - weight; // Tổng số kg cần tăng
        const totalSurplusCalories = totalWeightGain * calorieChangePerKg;
        totalDaysToReachTarget = Math.ceil(totalSurplusCalories / calorieSurplusPerDay);
    }

    // Phân phối lượng calo theo từng bữa
    const mealDistribution = {
        breakfast: adjustedTDEE * 0.3,
        lunch: adjustedTDEE * 0.4,
        dinner: adjustedTDEE * 0.3
    };

    console.log("Check all >> ", {
        daysShouldTraining,
        caloriesPerTraining,
        proteinRequirement,
        fatRequirement,
        totalDaysToReachTarget,
        mealDistribution
    });

    return {
        daysShouldTraining,
        caloriesPerTraining,
        proteinRequirement,
        fatRequirement,
        totalDaysToReachTarget,
        mealDistribution
    };
}


// phuong trinh Mifflin St Jeor
const BMR = (user) => {
    const { weight, height, age, gender } = user;

    return gender == "nam"
        ?
        (
            (10 * weight) + (6.25 * height) - (5 * age) + 5
        )
        :
        (
            (10 * weight) + (6.25 * height) - (5 * age) + 161
        )
}

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

            setUser({
                ...user,
                bmr: form.bmr,
                activityLevel: form.level_workout,
                tdee: form.tdee,
                daysShouldTraining: daysShouldTraining,
                caloriesPerTraining: caloriesPerTraining,
                totalDaysToReachTarget: totalDaysToReachTarget
            })

            router.push('/(root)/ChooseOrm')
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
                    <TouchableOpacity onPress={() => setSelected("Ít vận động")} className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Ít vận động' && 'border-[4px] border-[#3749db]'}`}>
                        <View className="flex flex-row justify-start items-center">
                            <FontAwesome name='desktop' size={32} color={"#3749db"} />
                            <Text className="flex-1 mx-4 font-pmedium text-[16px]">Ít vận động (ít hoặc không tập thể dục + làm việc văn phòng)</Text>
                            {
                                selected == 'Ít vận động' && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Hoạt động nhẹ")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Hoạt động nhẹ' && 'border-[4px] border-[#3749db]'}`}>
                        <MaterialCommunityIcons name='clock-time-four-outline' size={32} color={"#3749db"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Hoạt động nhẹ (tập thể dục nhẹ 1-3 ngày / tuần)</Text>
                        {
                            selected == 'Hoạt động nhẹ' && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục vừa phải")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục vừa phải' && 'border-[4px] border-[#3749db]'} `}>
                        <MaterialIcons name='directions-run' size={32} color={"#3749db"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục vừa phải (tập thể dục vừa phải 3-5 ngày / tuần)</Text>
                        {
                            selected == 'Tập thể dục vừa phải' && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục cường độ cao")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục cường độ cao' && 'border-[4px] border-[#3749db]'}`}>
                        <MaterialCommunityIcons name='dumbbell' size={32} color={"#3749db"} />

                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục hàng ngày hoặc tập thể dục cường độ cao 3-4 lần / tuần</Text>
                        {
                            selected == 'Tập thể dục cường độ cao' && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục nặng")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục nặng' && 'border-[4px] border-[#3749db]'}`}>
                        <MaterialCommunityIcons name='weight-lifter' size={32} color={"#3749db"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục nặng (tập thể dục nặng 6-7 ngày / tuần)</Text>
                        {
                            selected == 'Tập thể dục nặng' && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected("Tập thể dục rất căng thẳng")} className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${selected == 'Tập thể dục rất căng thẳng' && 'border-[4px] border-[#3749db]'}`}>
                        <MaterialCommunityIcons name='fire' size={32} color={"#3749db"} />
                        <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục rất căng thẳng hàng ngày hoặc công việc thể chất, nặng nhọc</Text>
                        {
                            selected == "Tập thể dục rất căng thẳng" && <AntDesign name={'checkcircle'} size={28} color={"#3749db"} />
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