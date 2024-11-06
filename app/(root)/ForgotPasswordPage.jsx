import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import InputField from '../../components/InputField'
import CustomButton from '../../components/CustomButton'
import LoadingModal from '../../components/LoadingModal'
import { isEmailExist } from '../../libs/mongodb'
import { ReactNativeModal } from "react-native-modal";
import { useSignIn } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo';
const ForgotPasswordPage = () => {

    const { colorScheme } = useColorScheme()
    const [email, setEmail] = useState("")
    const [verifyCode, setVerifyCode] = useState("")
    const { signIn } = useSignIn()
    const { signOut } = useAuth();
    const [isVisibleModelLoading, setIsVisibleModelLoading] = useState(false)
    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    });
    const handleSend = useCallback(async () => {
        setIsVisibleModelLoading(true)
        try {
            const data = await isEmailExist(email)

            if (data?.email === "") {
                Alert.alert(data?.message)
            }

            const created = await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            setVerification({
                ...verification,
                state: "pending",
            });
            setIsVisibleModelLoading(false)

        } catch (err) {
            setIsVisibleModelLoading(false)
            Alert.alert(err.errors[0].message);
        }
    })

    const onPressVerify = useCallback(async () => {
        setIsVisibleModelLoading(true)
        try {
            await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: verification.code,
            });
            setIsVisibleModelLoading(false)
            setVerification({
                ...verification,
                state: "success",
            });
            router.push(`/(root)/RecoveryPasswordPage/${email}`)
        } catch (err) {
            setIsVisibleModelLoading(false)
            Alert.alert(err.errors[0].message);
        }
    })

    return (
        <SafeAreaView className="h-full relative bg-[#fff] dark:bg-slate-950 pt-4">
            <View className="px-4 w-full flex flex-row justify-between items-center">
                <View className="flex flex-row justify-center items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <Text className="ml-4 font-pextrabold capitalize text-[28px] dark:text-white">Verify Email</Text>
                </View>
            </View>
            <View className="px-4 mt-4">
                <InputField value={email} onChange={(text) => setEmail(text)} placeholder="Enter your email" />
            </View>
            <View className="mt-4 px-4">
                <CustomButton text="Send" onPress={handleSend} />
            </View>
            <ReactNativeModal
                isVisible={verification.state === "pending"}
                onModalHide={() =>
                    setVerification({ ...verification, state: "success" })
                }
            >
                <View className={`bg-white px-7 py-9 rounded-2xl min-h-[300px]`}>
                    <Text className={`text-2xl font-pextrabold mb-2 `}>
                        Verification
                    </Text>
                    <Text className={`font-pregular mb-5`}>
                        We've sent a verification code to {email}
                    </Text>
                    <InputField
                        label={`Code`}
                        icon={<FontAwesome name='lock' size={24} style={{ marginLeft: 12 }} />}
                        placeholder={`12345`}
                        value={verification.code}
                        keyboardType={"numeric"}
                        onChange={(code) =>
                            setVerification({ ...verification, code })
                        }
                    />
                    {verification.error && (
                        <Text className={`text-red-500 text-sm mt-1`}>
                            {verification.error}
                        </Text>
                    )}
                    <CustomButton
                        text={'Verify Email'}
                        onPress={onPressVerify}
                        containerStyle={`mt-4`}
                    />
                </View>

            </ReactNativeModal>
            <LoadingModal visible={isVisibleModelLoading} message={"loading"} />
        </SafeAreaView>
    )
}

export default ForgotPasswordPage

const styles = StyleSheet.create({})