import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import InputField from '../../components/InputField'
import useUserStore from '../../store/userStore'
import { analyzeUser } from '../../utils/index'

const ChooseHeight = () => {

    const { user } = useUserStore()

    const setUser = useUserStore.getState().setUser
    const [date, setDate] = useState(new Date());

    const [conclusion, setConclusion] = useState({
        title: "",
        subtitle: "",
        body: "",
        percentageWeightChange: ""
    })

    const [form, setForm] = useState({
        weight: 0,
        height: 0,
        level: "Người mới bắt đầu",
        targetWeight: 0,
        age: 0,
        bmi: 0,
        targetBMI: 0
    })

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const calculateAge = () => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDifference = today.getMonth() - date.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
            age--;
        }
        return age;
    };


    useEffect(() => {

        if (form.weight && form.height && form.targetWeight) {
            const { currentBMI, targetBMI, percentageWeightChange, conclusion } = analyzeUser(
                form.weight, form.height, form.targetWeight
            )

            setForm((form) => ({
                ...form,
                bmi: currentBMI,
                targetBMI: targetBMI,
            }))

            setConclusion({
                percentageWeightChange: percentageWeightChange,
                title: conclusion.title,
                subtitle: conclusion.subtitle,
                body: conclusion.body
            })
        }

    }, [form.weight, form.height, form.targetWeight])

    useEffect(() => {

        const age = calculateAge(date);
        setForm((currentForm) => ({
            ...currentForm,
            age: age
        }));
    }, [date]);

    const handleNext = () => {
        try {
            if (!form.weight || !form.height) {
                Alert.alert("Lỗi", "Chiều cao hoặc cân nặng không hợp lệ!");
                return;
            }

            setUser({
                ...user,
                weight: form.weight,
                height: form.height,
                level: form.level,
                targetWeight: form.targetWeight,
                targetBMI: form.targetBMI,
                bmi: form.bmi,
                age: form.age
            })

            router.push('/(root)/ChooseTdee')
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    return (
        <SafeAreaView className="mt-4 h-full bg-[#fff]">
            <ScrollView>

                <View className="px-4 py-2">
                    <Text className="font-pbold text-[28px] text-center">Chiều cao và cân nặng</Text>
                </View>

                <View View className="px-4" >
                    <InputField
                        label={"Cân nặng"}
                        onChange={(value) => setForm((form) => ({ ...form, weight: value }))}
                        keyboardType="numeric"
                        placeholder="Cân nặng (kg)"
                        icon={<Ionicons name="body" size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Kg'}
                    />
                    <InputField
                        label={"Mục tiêu cân nặng"}
                        onChange={(value) => setForm((form) => ({ ...form, targetWeight: value }))}
                        keyboardType="numeric"
                        placeholder="Mục tiêu cân nặng (kg)"
                        icon={<MaterialCommunityIcons name="weight-lifter" size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Kg'}
                    />
                    <InputField
                        label={"Chiều cao"}
                        onChange={(value) => setForm((form) => ({ ...form, height: value }))}
                        keyboardType="numeric"
                        placeholder="Chiều cao (cm)"
                        icon={<MaterialCommunityIcons name="human-male-height" size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Cm'}
                    />
                    <View>
                        <Text className={`text-lg font-psemibold`}>
                            Sinh năm
                        </Text>
                        <View className={`flex flex-row justify-between items-center relative bg-neutral-100 rounded-full border border-neutral-100 my-2`}>
                            <TouchableOpacity onPress={showDatepicker}>
                                <Ionicons name="calendar-outline" size={24} style={{ marginLeft: 12 }} />
                            </TouchableOpacity>
                            <TextInput
                                editable={false}
                                className={`rounded-full p-4 font-JakartaSemiBold text-[15px] text-black flex-1 text-left`}
                                value={date.toLocaleDateString()}
                                placeholder={"Tuổi"}
                                autoCapitalize={'none'}
                            />


                            {/* display years old here */}
                            <Text className="px-4">{calculateAge()} Tuổi</Text>

                        </View>
                    </View>
                    <View>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />
                        )}
                    </View>
                </View>

                {
                    conclusion?.title && conclusion?.subtitle && conclusion?.body &&
                    <View className="p-4 m-4 rounded-lg bg-neutral-100">
                        <View className="flex flex-row justify-start items-center">
                            {
                                conclusion?.title == "Cảnh báo" &&
                                <Text className="text-lg mr-2">⚠️</Text>
                            }
                            {
                                conclusion?.title == "Mục tiêu hợp lý" &&
                                <Text className="text-lg mr-2 ">👌</Text>
                            }
                            {
                                conclusion?.title == "Lựa chọn nỗ lực" &&
                                <Text className="text-lg mr-2">💦</Text>
                            }
                            {
                                conclusion?.title == "Thử thách" &&
                                <Text className="text-lg mr-2">🔥</Text>
                            }
                            <Text className={`text-[20px] font-pbold uppercase ${conclusion?.title == "Cảnh báo" ? "text-red-500" :
                                conclusion?.title == "Mục tiêu hợp lý" ? "text-green-600" :
                                    conclusion?.title == "Thử thách" ? "text-orange-400" : "text-[#3749db]"
                                }`}>
                                {conclusion?.title}
                            </Text>
                        </View>
                        <View className="mt-1">
                            <Text className="text-[16px] font-pbold">{conclusion?.subtitle}</Text>
                        </View>
                        <View className="-mt-2">
                            <Text className="font-pmedium text-[15px]">{conclusion?.body}</Text>
                        </View>
                    </View>
                }

                <View className="px-4 mt-4">
                    <Text className="font-pbold text-[28px] text-center mb-4">Bạn là ?</Text>

                    <TouchableOpacity
                        onPress={() => setForm((form) => ({ ...form, level: "Người mới bắt đầu" }))}
                        className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${form.level == 'Người mới bắt đầu' && 'border-[2px] border-[#000]'}`}
                    >
                        <View className="flex flex-row justify-center items-center">
                            <FontAwesome name='battery-1' size={28} />
                        </View>
                        <View className="flex flex-1 ml-4 ">
                            <Text className="font-pextrabold text-lg">Người mới bắt đầu</Text>
                            <Text>Luyện tập ít hơn 6 tháng</Text>
                        </View>
                        {
                            form.level == 'Người mới bắt đầu' && <AntDesign name={'checkcircle'} size={28} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setForm((form) => ({ ...form, level: "Trung cấp" }))}
                        className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${form.level == 'Trung cấp' && 'border-[2px] border-[#000]'}`}
                    >
                        <View className="flex flex-row justify-center items-center">
                            <FontAwesome name='battery-2' size={28} />
                        </View>
                        <View className="flex flex-1 ml-4 mr-2">
                            <Text className="font-pextrabold text-lg">Trung cấp</Text>
                            <Text>Luyện tập hơn 6 tháng và ít hơn 2 năm</Text>
                        </View>
                        {
                            form.level == 'Trung cấp' && <AntDesign name={'checkcircle'} size={28} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setForm((form) => ({ ...form, level: "Thâm niên" }))}
                        className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${form.level == 'Thâm niên' && 'border-[2px] border-[#000]'}`}
                    >
                        <View className="flex flex-row justify-center items-center">
                            <FontAwesome name='battery-4' size={28} />
                        </View>
                        <View className="flex flex-1 ml-4">
                            <Text className="font-pextrabold text-lg">Thâm niên</Text>
                            <Text>Hơn 2 năm luyện tập</Text>
                        </View>
                        {
                            form.level == 'Thâm niên' && <AntDesign name={'checkcircle'} size={28} />
                        }
                    </TouchableOpacity>
                </View>
                <View className="ml-4 mr-4 mb-8">
                    <CustomButton bgColor='bg-[#3749db]' text="Tiếp theo" onPress={handleNext} textStyle={{
                        fontFamily: "Roboto-Bold"
                    }} />
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default ChooseHeight

const styles = StyleSheet.create({})