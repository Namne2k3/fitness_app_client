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
        return (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age))
    else
        return (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age))
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
        bmr: 0,
        hstq: 0,
        tdee: 0,
        orm: 0
    })

    const data = [
        'male',
        'female'
    ]

    useEffect(() => {
        const fetchUserByEmail = async () => {
            const userData = await getUserByEmail(email)
            setUser(userData)
            setUserDataStore(userData)
        }

        fetchUserByEmail()
    }, [])

    const handlePressSend = useCallback(async () => {
        try {
            setIsVisibleLoadingModal(true)
            if (values.weight && values.height && values.age && values.gender && values.hstq) {
                const bmrValue = calculateBmr(values.weight, values.height, values.gender, values.age);
                const tdeeValue = calculateTdee(bmrValue, values.hstq);
                setValues({
                    ...values,
                    bmr: bmrValue,
                    tdee: tdeeValue
                });

                const savedData = await handleUpdateUser({
                    ...user,
                    weight: values.weight,
                    height: values.height,
                    age: values.age,
                    tdee: tdeeValue,
                    orm: values.orm
                })
                setIsVisibleLoadingModal(false)
                router.replace('/(root)/(tabs)/training')
            } else {
                setIsVisibleLoadingModal(false)
                Alert.alert("Please fill in complete information")
            }
        } catch (error) {
            setIsVisibleLoadingModal(false)
            Alert.alert(error.message)
        }
    })

    return (
        <SafeAreaView className="bg-[#fff] dark:bg-slate-950 h-full p-4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal={false}
            >
                <Text className="font-pextrabold text-[24px]">Please help us by filling some information.</Text>
                <View className="flex mt-4">
                    <InputField
                        onChange={(text) => setValues({ ...values, weight: text })}
                        keyboardType="numeric"
                        placeholder="Your weight (kg)"
                        icon={<Ionicons name='body' size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Kg'}
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, height: text })}
                        keyboardType="numeric"
                        placeholder="Your height (cm)"
                        icon={<MaterialCommunityIcons name='human-male-height' size={24} style={{ marginLeft: 12 }} />}
                        textRight={'Cm'}
                    />
                    <InputField
                        onChange={(text) => setValues({ ...values, age: text })}
                        keyboardType="numeric"
                        placeholder="Your age"
                    />

                    <Text className="font-psemibold text-md mt-6">The heaviest weight you can lift at one time</Text>
                    <InputField
                        onChange={(text) => setValues({ ...values, orm: text })}
                        keyboardType="numeric"
                        placeholder="Your heaviest weight"
                    />
                    <SelectList
                        boxStyles={{
                            marginTop: 12
                        }}
                        setSelected={(text) => setValues({ ...values, gender: text })}
                        data={data}
                        save="value"
                        placeholder="Gender"
                        search={false}
                    />

                    <Text className="font-psemibold text-md mt-6">How many days do you spend on training?</Text>
                    <SelectList
                        boxStyles={{
                            marginTop: 6
                        }}
                        dropdownTextStyles={{
                            fontSize: 18
                        }}
                        dropdownItemStyles={{
                            width: 100
                        }}
                        setSelected={(text) => {
                            let hstqValue = null;

                            if (text == 0) {
                                hstqValue = 1.2;
                            } else if (text >= 1 && text < 3) {
                                hstqValue = 1.375;
                            } else if (text >= 3 && text <= 5) {
                                hstqValue = 1.55;
                            } else if (text >= 6 && text <= 7) {
                                hstqValue = 1.725;
                            }

                            setValues({
                                ...values,
                                hstq: hstqValue,
                            });
                        }}
                        data={[0, 1, 2, 3, 4, 5, 6, 7]}
                        placeholder="Options"
                        search={false}
                    />
                </View>
                <CustomButton containerStyle={"mt-4"} text={'Continue'} onPress={handlePressSend} />
            </ScrollView>
            <LoadingModal visible={isVisibleLoadingModal} message={'Loading'} />
        </SafeAreaView>
    )
}

export default FillInformation
const styles = StyleSheet.create({})