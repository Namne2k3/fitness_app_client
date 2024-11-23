import { AntDesign, Entypo } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import useUserStore from '../../store/userStore'
import { calculate1RM, generateExercisePlan, sendJSONByEmail, generateTrainings } from '../../utils/index'
import { createTrainings, getAllExercises, handleUpdateUser } from '../../libs/mongodb'
import { router } from 'expo-router'
import LoadingModal from '../../components/LoadingModal'

const seedData = [
    {
        name: "Bench Press",
        value: "Bench Press",
        url: "https://drive.google.com/uc?id=13ibeDSBV0wx7lpYJI9f2N2xc85ky0ztc"
    },
    {
        name: "Deadlift",
        value: "Deadlift",
        url: "https://drive.google.com/uc?id=16To7ZKpunF0vQugU4oPsrm3NAjA1Fzzf"
    },
    {
        name: "Squats",
        value: "Squats",
        url: "https://drive.google.com/uc?id=1vqA6d5AQw336tvhRuY3SeizWK7GZtyVx"
    }
]

function urlSelected(name) {
    let selected = {}
    seedData.forEach((item) => {
        if (item.name == name)
            selected = item
    })

    return selected.url
}

const ChooseOrm = () => {
    const [selected, setSelected] = useState(seedData[0].name)
    const [isLbs, setIsLbs] = useState(false)
    const [weight, setWeight] = useState(Number(0))
    const [reps, setReps] = useState(Number(1))
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const { colorScheme } = useColorScheme()
    const [isLoading, setIsLoading] = useState(false)
    const [exercises, setExercises] = useState([])

    const handleNext = async () => {
        setIsLoading(true)
        try {
            let ormValue = calculate1RM(weight, reps, selected)

            setUser({
                ...user,
                orm: ormValue
            })

            const updatedUser = await handleUpdateUser({
                ...user,
                orm: ormValue
            })

            // tao plan ngay tai day
            // const createdPlans = await generateExercisePlan(updatedUser, exercises)
            const createdPlans = await generateTrainings(updatedUser, exercises)
            // sendJSONByEmail(createdPlans)

            // luu plan vo db tai day
            const savedPlan = await createTrainings(createdPlans)

            // tao plan 30 ngay tai day


            router.replace('/(root)/(tabs)/training')

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchAllExercises = async () => {
            try {
                const res = await getAllExercises();
                setExercises(res.data)
            } catch (error) {
                Alert.alert("Lỗi", error.message)
            }
        }

        fetchAllExercises()
    }, [])

    return (
        <>
            <SafeAreaView className="flex flex-col flex-1 h-full bg-[#fff]">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    padding: 16
                }}>
                    <View className="flex flex-row justify-center items-center">
                        <Text className="font-pextrabold text-[28px] dark:text-white text-center">Estimate your 1RM</Text>
                    </View>
                    <View className="flex justify-start items-center mt-4">
                        <Image
                            source={{
                                uri: urlSelected(selected)
                            }}
                            className="w-[320px] max-w-full h-[250px]"
                            resizeMode='contain'
                        />
                    </View>
                    <View className="border-b-[0.5px] border-[#ccc]">
                        <View className="flex flex-row items-center p-2">
                            <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Bài tạ</Text>
                            <View className="flex-1">
                                <SelectList
                                    boxStyles={{
                                        marginTop: 12,
                                        width: 150,
                                        borderColor: colorScheme == 'dark' ? '#fff' : "#000",
                                        backgroundColor: colorScheme == 'dark' ? "#000" : "#fff",
                                        borderWidth: 1,
                                    }}
                                    inputStyles={{
                                        color: colorScheme == 'dark' ? '#fff' : "#000",
                                    }}
                                    dropdownStyles={{
                                        backgroundColor: colorScheme == 'dark' ? "#000" : "#fff",
                                        borderColor: colorScheme == 'dark' ? "#fff" : "#000",
                                    }}
                                    arrowicon={
                                        <Entypo name="select-arrows" size={20} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                    }
                                    dropdownTextStyles={{
                                        color: colorScheme == 'dark' ? '#fff' : '#000'
                                    }}
                                    setSelected={(item) => {
                                        setSelected(item)
                                    }}
                                    data={seedData}
                                    placeholder={selected}
                                    save="value"
                                    search={false}
                                />
                            </View>
                        </View>
                        <View className="flex flex-row justify-between items-center p-2">
                            <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Nâng tạ</Text>
                            <View className='flex flex-row justify-end items-center flex-1'>
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <TextInput
                                            className={`bg-[#ccc] mr-2 font-bold my-2 dark:text-white rounded-lg p-2 text-lg flex-1 text-left`}
                                            keyboardType="numeric"
                                            value={(isLbs ? (weight * 2.20462) : weight || 0).toString()}
                                            onChangeText={(text) => {
                                                const numericValue = parseFloat(text);
                                                if (!isNaN(numericValue)) setWeight(numericValue);
                                            }}
                                        />
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                                <TouchableOpacity
                                    // onPress={() => changeToLbs()}
                                    className="flex flex-row justify-center items-center w-[40px]"
                                >
                                    <Text className="font-pmedium dark:text-white">
                                        {isLbs ? 'lbs' : 'kg'}
                                    </Text>
                                    <Entypo name="select-arrows" size={20} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-between items-center p-2">
                            <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Khi mệt tôi có thể nâng</Text>
                            <View className='flex flex-row justify-end items-center flex-1'>
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <TextInput
                                            className={`bg-[#ccc] font-bold my-2 dark:text-white rounded-lg p-2 text-lg flex-1 text-left`}
                                            keyboardType='numeric'
                                            value={reps}
                                            placeholder={`${reps}`}
                                            onChangeText={(rep) => setReps(rep)}
                                        />
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                                <View
                                    className="flex flex-row justify-center items-center w-[40px]"
                                >
                                    <Text className="font-pmedium dark:text-white">
                                        Lần
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="">
                        <View className="flex flex-row justify-between items-center p-2">
                            <View className="flex">
                                <Text className="font-pbold text-lg dark:text-white">1RM của bạn</Text>
                                <Text className="font-pregular text-[12px] dark:text-white">({selected})</Text>
                            </View>
                            <View className='flex flex-row justify-end items-center flex-1'>
                                <Text className="font-pextrabold text-lg mr-2 dark:text-white">
                                    {calculate1RM(weight, reps, selected).toFixed(0)}
                                </Text>
                                <Text className="font-pregular dark:text-white">{isLbs ? 'lbs' : 'kg'}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="absolute bottom-0 m-4">
                    <CustomButton onPress={handleNext} text="Tiến hành thiết lập" textStyle={{
                        fontFamily: "Roboto-Bold"
                    }} />
                </View>
                <LoadingModal visible={isLoading} />
            </SafeAreaView>
        </>
    )
}

export default ChooseOrm

const styles = StyleSheet.create({})