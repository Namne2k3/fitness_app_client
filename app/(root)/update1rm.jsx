import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Image } from 'expo-image'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import LoadingModal from '../../components/LoadingModal'
import { handleUpdateUser } from '../../libs/mongodb'
import useUserStore from '../../store/userStore'
import { calculate1RM } from '../../utils/index'

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

const Update1rm = () => {
    const { colorScheme } = useColorScheme()
    const [selected, setSelected] = useState(seedData[0].name)
    const [isLbs, setIsLbs] = useState(false)
    const [weight, setWeight] = useState(Number(0))
    const [reps, setReps] = useState(Number(1))
    const user = useUserStore((state) => state.user)
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)

    const updateUser = async () => {
        setIsVisibleLoadingModal(true)
        const orm = calculate1RM(weight, reps, selected)
        try {
            if (orm) {
                const res = await handleUpdateUser({
                    ...user,
                    orm: orm
                })
                if (res) {
                    setIsVisibleLoadingModal(false)
                    Alert.alert("Thông tin đã được cập nhật!")
                    router.replace('/(root)/myprofile')
                } else {
                    throw new Error()
                }
            } else {
                setIsVisibleLoadingModal(false)
            }

        } catch (error) {
            setIsVisibleLoadingModal(false)
            console.log(error);

        }
    }

    return (
        <>
            <SafeAreaView className="h-full p-4 pb-8 bg-[#fff] dark:bg-slate-950">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex flex-row justify-start items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="pr-4"
                            style={{
                                backgroundColor: 'transparent'
                            }}
                        >
                            <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                        <Text className="font-pextrabold text-[28px] dark:text-white">1RM của tôi</Text>
                    </View>
                    <View className="flex justify-start items-center">
                        <Image
                            source={{
                                uri: urlSelected(selected)
                            }}
                            className="w-[320px] max-w-full h-[250px]"
                            contentFit='contain'
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
                                        <AntDesign
                                            name='arrowdown'
                                            color={colorScheme == 'dark' ? '#fff' : "#000"}
                                            size={18}
                                        />
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
                                            keyboardType='numeric'
                                            value={isLbs ? (weight * 2.20462) : weight}
                                            onChangeText={(weight) => setWeight(weight)}
                                            placeholder={user?.orm.toString()}
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
                                            className={`bg-[#ccc] mr-2 font-bold my-2 dark:text-white rounded-lg p-2 text-lg flex-1 text-left`}
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
                                        Hiệp
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
                                <Text className="font-pbold text-lg mr-2 dark:text-white">
                                    {calculate1RM(weight, reps, selected)}
                                </Text>
                                <Text className="font-pregular dark:text-white">{isLbs ? 'lbs' : 'kg'}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <CustomButton bgColor='bg-[#3749db]' onPress={updateUser} text={'Cập nhật'} />

            </SafeAreaView>
            <LoadingModal visible={isVisibleLoadingModal} />
        </>
    )
}

export default Update1rm

const styles = StyleSheet.create({})