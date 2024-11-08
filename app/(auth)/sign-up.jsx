import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import InputField from '../../components/InputField'
import { useSignUp } from '@clerk/clerk-expo'
import { ReactNativeModal } from "react-native-modal";
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { createUser } from '../../libs/mongodb'
import LoadingModal from '../../components/LoadingModal'
const SignUp = () => {

    const { isLoaded, signUp, setActive } = useSignUp()
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: ''
    })

    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    });

    const handleSubmitSignUp = useCallback(async () => {
        if (!isLoaded) {
            return
        }
        try {
            setIsVisibleLoadingModal(true)
            await signUp.create({
                emailAddress: form.email,
                username: form.username,
                password: form.password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setVerification({
                ...verification,
                state: "pending",
            });

            setIsVisibleLoadingModal(false)
        } catch (err) {
            setIsVisibleLoadingModal(false)
            Alert.alert("Error", err.errors[0].longMessage);
        }
    }, [isLoaded, form.email, form.password, form.username])

    const onPressVerify = async () => {

        if (!isLoaded) {
            return
        }

        try {
            setIsVisibleLoadingModal(true)
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })

                await createUser({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    clerkId: completeSignUp.createdUserId
                })
                setIsVisibleLoadingModal(false)
                router.push(`/(root)/FillInformation/${form?.email}`)
            } else {
                setIsVisibleLoadingModal(false)
                console.error(JSON.stringify(completeSignUp, null, 2))
            }

        } catch (err) {
            setIsVisibleLoadingModal(false)
            Alert.alert("Error", err.errors[0].longMessage);
        }
    }
    return (
        <SafeAreaView className="p-8 bg-[#fff] h-full">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="font-pextrabold text-[32px] mb-4 text-center">Sign Up</Text>

                <InputField
                    value={form.email}
                    onChange={(text) => setForm({ ...form, email: text })}
                    label={'Email'}
                    icon={<MaterialIcons name={`alternate-email`} size={24} style={{ marginLeft: 12 }} />}
                />

                <InputField
                    value={form.username}
                    onChange={(text) => setForm({ ...form, username: text })}
                    label={'Username'}
                    icon={<AntDesign name={`user`} size={24} style={{ marginLeft: 12 }} />}
                />

                <InputField
                    value={form.password}
                    onChange={(text) => setForm({ ...form, password: text })}
                    label={'Password'}
                    icon={<MaterialIcons name={`password`} size={24} style={{ marginLeft: 12 }} />}
                />

                <CustomButton containerStyle={`mt-4`} text={`Sign Up`} onPress={handleSubmitSignUp} />

                <View className="flex flex-row justify-center items-center mt-4">
                    <Text className="font-pmedium text-[15px]">Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                        <Text className="font-psemibold text-[#00008B] text-[15px]"> Log In</Text>
                    </TouchableOpacity>
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
                            We've sent a verification code to {form.email}
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
            </ScrollView>
            <LoadingModal visible={isVisibleLoadingModal} message={"Loading"} />
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({})