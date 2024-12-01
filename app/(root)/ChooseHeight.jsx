import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '../../components/InputField'
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import useUserStore from '../../store/userStore'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import DateTimePicker from '@react-native-community/datetimepicker';


function analyzeUser(weight, height, targetWeight) {
    if (!weight || !height || !targetWeight) {
        throw new Error("Chưa có một trong các dữ liệu sau (Chiều cao, cân nặng, mục tiêu cân nặng).");
    }

    const calculateBMI = (weight, height) => (weight / ((height / 100) ** 2)).toFixed(2);
    const currentBMI = calculateBMI(weight, height);
    const targetBMI = calculateBMI(targetWeight, height);

    const percentageWeightChange = Math.abs(((targetWeight - weight) / weight) * 100).toFixed(2);

    let result = {
        title: "",
        subtitle: "",
        body: ""
    };

    // Define thresholds
    const lowerLimit = 0.90 * weight; // 90% of current weight
    const upperLimit = 1.10 * weight; // 110% of current weight
    const effortLimit = 1.15 * weight; // 115% of current weight
    const challengeLimit = 1.35 * weight; // 135% of current weight

    // Classify target weight
    if (targetWeight < lowerLimit) {
        result = {
            title: "Cảnh báo",
            subtitle: `Bạn sẽ giảm ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Giảm cân quá mức có thể gây hại cho sức khỏe:
- Mệt mỏi và suy nhược cơ thể
- Suy giảm hệ miễn dịch
- Nguy cơ mắc bệnh thiếu máu
Hãy tham khảo ý kiến chuyên gia để điều chỉnh mục tiêu phù hợp.
            `
        };
    } else if (targetWeight >= lowerLimit && targetWeight <= upperLimit) {
        result = {
            title: "Mục tiêu hợp lý",
            subtitle: `Bạn sẽ thay đổi ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Những thay đổi nhỏ về cân nặng có thể mang lại lợi ích lớn:
- Hạ huyết áp
- Giảm nguy cơ mắc bệnh tiểu đường
- Cải thiện sức khỏe tổng thể
Hãy duy trì chế độ luyện tập và ăn uống cân bằng để đạt được mục tiêu.
            `
        };
    } else if (targetWeight > upperLimit && targetWeight <= effortLimit) {
        result = {
            title: "Lựa chọn nỗ lực",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Mục tiêu này có thể đạt được với một chút nỗ lực:
- Tăng cường sức mạnh cơ bắp
- Cải thiện năng lượng và sức bền
- Xây dựng hình thể lý tưởng
Hãy tập trung vào chế độ dinh dưỡng và luyện tập để đạt kết quả tốt.
            `
        };
    } else if (targetWeight > effortLimit && targetWeight <= challengeLimit) {
        result = {
            title: "Thử thách",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Mục tiêu này đòi hỏi sự kiên nhẫn và quyết tâm cao:
- Cần thời gian để xây dựng khối lượng cơ
- Tăng cường sự tự tin và sức mạnh
- Cải thiện đáng kể vóc dáng
Hãy xây dựng kế hoạch chi tiết và kiên định với mục tiêu.
            `
        };
    } else if (targetWeight > challengeLimit) {
        result = {
            title: "Cảnh báo",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Tăng cân quá mức có thể gây hại cho sức khỏe:
- Gia tăng nguy cơ béo phì
- Nguy cơ mắc các bệnh tim mạch
- Tăng áp lực lên khớp và xương
Hãy tham khảo ý kiến chuyên gia để điều chỉnh mục tiêu.
            `
        };
    }

    return {
        currentBMI: currentBMI,
        targetBMI: targetBMI,
        percentageWeightChange: `${percentageWeightChange}%`,
        conclusion: result
    };
}

const ChooseHeight = () => {

    const user = useUserStore.getState().user

    console.log("Checking user >>> ", user);


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

            console.log("Check currentBMI >>> ", currentBMI);
            console.log("Check targetBMI >>> ", targetBMI);
            console.log("Check percentageWeightChange >>> ", percentageWeightChange);
            console.log("Check conclusion >>> ", conclusion);

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
                {/* <View className="h-[50px]"></View> */}
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