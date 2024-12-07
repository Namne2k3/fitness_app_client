import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import InputField from '../../components/InputField'
import LoadingModal from '../../components/LoadingModal'
import { getUserByEmail, updateUserById } from '../../libs/mongodb'
import useUserStore from '../../store/userStore'
import { requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';


const SignIn = () => {
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [form, setForm] = useState({
        email: 'nhpn2003@gmail.com',
        password: 'nhpn2003',
    })

    const registerPushToken = async () => {
        const { status } = await requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission not granted for notifications');
            return;
        }

        const token = (await getExpoPushTokenAsync()).data;

        // // Gửi token lên server
        // await fetch('https://your-server.com/api/save-token', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ userId, pushToken: token }),
        // });
        return token
    }

    const setUser = useUserStore((state) => state.setUser)

    const onSignInPress = useCallback(async () => {
        try {
            setIsVisibleLoadingModal(true)

            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL_SERVER}/api/auth/login`, {
                email: form.email,
                password: form.password,
            })

            if (response.status == 400) {
                throw new Error(response.message)
            }

            const data = await response.data;

            if (data.token) {

                await AsyncStorage.setItem('jwt_token', data.token);
                const userData = await getUserByEmail(form.email)
                const pushToken = await registerPushToken()
                await updateUserById({ ...userData, pushToken: pushToken })

                setUser(userData)
                if (!userData.weight || !userData.height || userData.height == "0" || !userData.orm || !userData.tdee) {
                    router.replace(`/(root)/ChooseGender`)
                    return;
                }

                router.replace('/(root)/(tabs)/training')

            } else {
                Alert.alert("Không thể đăng nhập", data.message);
            }

        } catch (err) {
            Alert.alert("Lỗi", err.message);
        } finally {
            setIsVisibleLoadingModal(false)
        }

    }, [form.email, form.password])
    return (
        <SafeAreaView className="p-8 bg-[#fff] h-full">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="font-pextrabold text-[32px] mb-4 text-center">Đăng nhập</Text>
                <InputField
                    onChange={(text) => setForm({ ...form, email: text })}
                    label={'Email'}
                    icon={<MaterialIcons name={`alternate-email`} size={24} style={{ marginLeft: 12 }} />}
                    keyboardType="email"
                />
                <InputField
                    onChange={(text) => setForm({ ...form, password: text })}
                    label={'Mật khẩu'}
                    icon={<MaterialIcons name={`password`} size={24} style={{ marginLeft: 12 }} />}
                />
                <CustomButton bgColor='bg-[#3749db]' containerStyle={`mt-4`} text={`Đăng nhập`} onPress={onSignInPress} />
                <View className="flex">
                    <View className="flex flex-row justify-center items-center mt-4">
                        <Text className="font-pmedium text-[15px]">Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
                            <Text className="font-psemibold text-[#3749db] text-[15px]"> Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(root)/ForgotPasswordPage')}>
                        <Text className="text-center italic font-pmedium text-[#3749db]">Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <LoadingModal visible={isVisibleLoadingModal} />
        </SafeAreaView>
    )
}

export default SignIn