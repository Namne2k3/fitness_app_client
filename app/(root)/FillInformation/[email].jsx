import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '../../../components/InputField'
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../../../components/CustomButton'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { getUserByEmail, handleUpdateUser } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import LoadingModal from '../../../components/LoadingModal'

function calculateBmr(weight, height, gender, age) {
    if (gender == 'male')
        return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    else
        return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
}

function calculateTdee(bmr, hstq) {
    return bmr * hstq
}

const FillInformation = () => {
    const [user, setUser] = useState({})
    const setUserDataStore = useUserStore((state) => state.setUser)
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const { email } = useLocalSearchParams()
    const [values, setValues] = useState({
        weight: 0,
        height: 0,
        age: 0,
        gender: '',
        waist: 0,
        hip: 0,
        sleep: 0,
        activityLevel: '',
        healthGoal: '',
        bmr: 0,
        hstq: 0,
        tdee: 0,
        orm: 0
    })

    const genderOptions = ['Nam', 'Nữ']
    const healthGoals = ['Giảm cân', 'Tăng cơ', 'Duy trì cân nặng', 'Cải thiện sức khỏe']

    const handlePressSend = useCallback(async () => {
        try {


            setIsVisibleLoadingModal(true);

            if (values.weight && values.height && values.age && values.gender && values.activityLevel) {



                const bmrValue = calculateBmr(values.weight, values.height, values.gender, values.age);
                const tdeeValue = calculateTdee(bmrValue, values.activityLevel);

                setValues({
                    ...values,
                    hstq: values.activityLevel,  // Cập nhật hstq
                    bmr: bmrValue,
                    tdee: tdeeValue
                });

                // Tiến hành xử lý và gửi dữ liệu, ví dụ: cập nhật người dùng trong cơ sở dữ liệu
                const savedData = await handleUpdateUser({
                    ...user,
                    ...values,
                    bmr: bmrValue,
                    tdee: tdeeValue
                })

                setIsVisibleLoadingModal(false);
                const { conclusion, suggestions } = analyzeAndSuggest(values);
                Alert.alert(
                    'Kết quả phân tích',
                    `${conclusion}\n\nGợi ý:\n${suggestions.join('\n')}`
                );

                router.replace('/(root)/(tabs)/training')
            } else {
                setIsVisibleLoadingModal(false);
                Alert.alert("Vui lòng điền đầy đủ thông tin!");
            }
        } catch (error) {
            setIsVisibleLoadingModal(false);
            Alert.alert(error.message);
        }
    });


    const analyzeAndSuggest = (values) => {
        const { weight, height, waist, hip, age, gender, sleep, hstq, healthGoal } = values;

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const whr = waist / hip;

        let conclusion = '';
        let suggestions = [];

        if (bmi < 18.5) {
            conclusion += 'Bạn thuộc nhóm thiếu cân. ';
            suggestions.push('Tăng cường chế độ ăn uống giàu dinh dưỡng để tăng cân.');
        } else if (bmi < 24.9) {
            conclusion += 'Bạn có chỉ số BMI bình thường. ';
            suggestions.push('Duy trì chế độ tập luyện và ăn uống lành mạnh.');
        } else if (bmi < 29.9) {
            conclusion += 'Bạn thuộc nhóm thừa cân. ';
            suggestions.push('Nên tập luyện thường xuyên, đặc biệt là các bài tập đốt mỡ như cardio.');
        } else {
            conclusion += 'Bạn thuộc nhóm béo phì. ';
            suggestions.push('Cần giảm cân bằng cách kết hợp tập luyện và kiểm soát chế độ ăn.');
        }

        if ((gender === 'Nam' && whr > 0.9) || (gender === 'Nữ' && whr > 0.85)) {
            conclusion += 'Bạn có nguy cơ cao về sức khỏe liên quan đến mỡ bụng. ';
            suggestions.push('Tập trung vào các bài tập giảm mỡ bụng như plank, crunches, và chạy bộ.');
        }

        if (healthGoal === 'Giảm cân') {
            suggestions.push('Tập luyện ít nhất 5-6 ngày mỗi tuần với các bài tập cường độ trung bình hoặc cao.');
        } else if (healthGoal === 'Tăng cơ') {
            suggestions.push('Nên tập luyện 4-5 ngày mỗi tuần với các bài tập tạ, kết hợp ăn nhiều protein.');
        } else if (healthGoal === 'Cải thiện sức khỏe') {
            suggestions.push('Chỉ cần duy trì 3-4 ngày tập luyện mỗi tuần với các bài tập vừa sức.');
        }

        if (sleep < 6) {
            suggestions.push('Nên ngủ đủ 7-8 tiếng mỗi ngày để tăng hiệu quả tập luyện và cải thiện sức khỏe.');
        }

        return { conclusion, suggestions };
    }

    const activityOptions = [
        'Ít vận động (Ngồi làm việc, ít đi lại)',
        'Hoạt động nhẹ (Đi lại nhẹ nhàng, thể thao không thường xuyên)',
        'Hoạt động vừa phải (Tập luyện thể thao đều đặn)',
        'Hoạt động nhiều (Làm việc nặng hoặc tập luyện chuyên sâu)',
        'Vận động cực kỳ nhiều'
    ]
    const activityLevelToHstq = {
        'Ít vận động (Ngồi làm việc, ít đi lại)': 1.2,
        'Hoạt động nhẹ (Đi lại nhẹ nhàng, thể thao không thường xuyên)': 1.375,
        'Hoạt động vừa phải (Tập luyện thể thao đều đặn)': 1.55,
        'Hoạt động nhiều (Làm việc nặng hoặc tập luyện chuyên sâu)': 1.725,
        'Vận động cực kỳ nhiều': 1.9
    };


    useEffect(() => {
        const fetchUserByEmail = async () => {
            const userData = await getUserByEmail(email)
            setUser(userData)
            setUserDataStore(userData)
        }

        fetchUserByEmail()
    }, [])


    return (
        <SafeAreaView className="bg-[#fff] dark:bg-slate-950 h-full p-4">
            <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
                <Text className="font-pextrabold text-[24px]">Vui lòng điền một số thông tin</Text>
                <View className="flex mt-4">
                    <InputField
                        onChange={(text) => setValues({ ...values, weight: text })}
                        keyboardType="numeric"
                        placeholder="Cân nặng (kg)"
                        icon={<Ionicons name="body" size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Kg'}
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, height: text })}
                        keyboardType="numeric"
                        placeholder="Chiều cao (cm)"
                        icon={<MaterialCommunityIcons name="human-male-height" size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Cm'}
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, orm: text })}
                        keyboardType="numeric"
                        placeholder="Mức tạ tối đa trong bài Bench Press"
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, age: text })}
                        keyboardType="numeric"
                        placeholder="Tuổi"
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, waist: text })}
                        keyboardType="numeric"
                        placeholder="Vòng eo (cm)"
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, hip: text })}
                        keyboardType="numeric"
                        placeholder="Vòng hông (cm)"
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, sleep: text })}
                        keyboardType="numeric"
                        placeholder="Thời gian ngủ mỗi ngày (giờ)"
                    />
                    <SelectList
                        boxStyles={{
                            marginTop: 12
                        }}
                        setSelected={(text) => setValues({ ...values, gender: text })}
                        data={genderOptions}
                        save="value"
                        placeholder="Giới tính"
                        search={false}
                    />
                    <SelectList
                        boxStyles={{
                            marginTop: 12
                        }}
                        setSelected={(text) => setValues({ ...values, activityLevel: activityLevelToHstq[text] })}
                        data={activityOptions}
                        save="value"
                        placeholder="Mức độ hoạt động"
                        search={false}
                    />
                    {/* <SelectList
                        boxStyles={{
                            marginTop: 12
                        }}
                        setSelected={(text) => setValues({ ...values, diet: text })}
                        data={dietOptions}
                        save="value"
                        placeholder="Chế độ ăn"
                        search={false}
                    /> */}
                    <SelectList
                        boxStyles={{
                            marginTop: 12
                        }}
                        setSelected={(text) => setValues({ ...values, healthGoal: text })}
                        data={healthGoals}
                        save="value"
                        placeholder="Mục tiêu sức khỏe"
                        search={false}
                    />
                </View>
                <CustomButton containerStyle={'mt-4'} text={'Tiếp tục'} onPress={handlePressSend} />
            </ScrollView>
            <LoadingModal visible={isVisibleLoadingModal} message={'Đang xử lý'} />
        </SafeAreaView>
    )
}

export default FillInformation
const styles = StyleSheet.create({})
