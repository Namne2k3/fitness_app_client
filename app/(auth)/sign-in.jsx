import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '../../components/InputField'
import CustomButton from '../../components/CustomButton'
import { useSignIn } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons'
import { getUserByEmail } from '../../libs/mongodb'
import LoadingModal from '../../components/LoadingModal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import useUserStore from '../../store/userStore'
const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn()
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [form, setForm] = useState({
        email: 'nhpn2003@gmail.com',
        password: 'nhpn2003'
    })


    console.log("Day la trang sign in");


    const setUser = useUserStore((state) => state.setUser)

    const onSignInPress = useCallback(async () => {

        if (!isLoaded) {
            return
        }

        try {
            setIsVisibleLoadingModal(true)
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL_SERVER}/api/auth/login`, {
                email: form.email,
                password: form.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.data;

            if (data.token) {

                await AsyncStorage.setItem('jwt_token', data.token);
                const userData = await getUserByEmail(form.email)
                setUser(userData)
                if (!userData.weight || !userData.height || userData.height == "0" || !userData.orm || !userData.tdee) {
                    setIsVisibleLoadingModal(false)
                    router.replace(`/(root)/ChooseGender`)
                    return;
                }
                setIsVisibleLoadingModal(false)
                router.replace('/(root)/(tabs)/training')
                // router.push('/(root)/ChooseGender')

            } else {
                Alert.alert("Can't login, have some error while login", data.message);
            }

        } catch (err) {
            setIsVisibleLoadingModal(false)
            Alert.alert("Error", err.message);
        }

    }, [isLoaded, form.email, form.password])
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
                <CustomButton containerStyle={`mt-4`} text={`Đăng nhập`} onPress={onSignInPress} />
                <View className="flex">
                    <View className="flex flex-row justify-center items-center mt-4">
                        <Text className="font-pmedium text-[15px]">Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
                            <Text className="font-psemibold text-[#00008B] text-[15px]"> Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(root)/ForgotPasswordPage')}>
                        <Text className="text-center italic font-pmedium text-[#00008B]">Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <LoadingModal visible={isVisibleLoadingModal} />
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})