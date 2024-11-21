import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/CustomButton'
import LoadingModal from '../../../components/LoadingModal'
import InputField from '../../../components/InputField'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { router, useLocalSearchParams } from 'expo-router'
import { handleUpdateUserByEmail } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
const RecoveryPasswordPage = () => {

    const { colorScheme } = useColorScheme()
    const [loadingModal, setLoadingModal] = useState(false)
    const user = useUserStore((state) => state.user)
    const { email } = useLocalSearchParams()

    const [form, setForm] = useState({
        password: "",
        newPassword: ""
    })

    const handleSubmit = async () => {
        if (form.password !== form.newPassword) {
            Alert.alert("Mật khẩu không trùng khớp.");
            return;
        }
        setLoadingModal(true);

        try {
            const updatedUser = await handleUpdateUserByEmail(email, form.password)
            Alert.alert("Mật khẩu đã được tạo lại!");
            setLoadingModal(false);
            router.replace('/(auth)/sign-in'); // Navigate back after successful reset
        } catch (error) {
            setLoadingModal(false);
            Alert.alert("Xảy ra lỗi khi tạo lại mật khẩu:", error.message);
        } finally {
            setLoadingModal(false);
        }
    }

    return (
        <SafeAreaView className="h-full relative bg-[#fff] dark:bg-slate-950 pt-4">
            <View className="px-4 w-full flex flex-row justify-between items-center">
                <View className="flex flex-row justify-center items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <Text className="ml-4 font-pextrabold uppercase text-[28px] dark:text-white">Tạo lại mật khẩu</Text>
                </View>
            </View>
            <View className="px-4 mt-4">
                <InputField
                    placeholder="Mật khẩu mới"
                    label={'Mật khẩu'}
                    icon={<MaterialIcons name={`password`} size={24} style={{ marginLeft: 12 }} />}
                    onChange={text => setForm({ ...form, password: text })}
                    value={form.password}
                />
            </View>
            <View className="px-4 mt-4">
                <InputField
                    placeholder="Mật khẩu mới"
                    label={'Nhập lại mật khẩu'}
                    icon={<MaterialIcons name={`password`} size={24} style={{ marginLeft: 12 }} />}
                    onChange={text => setForm({ ...form, newPassword: text })}
                    value={form.newPassword}
                />
            </View>
            <View className="mt-4 px-4">
                <CustomButton text="Xác nhận" onPress={handleSubmit} />
            </View>

            <LoadingModal visible={loadingModal} message={"Đang tải..."} />
        </SafeAreaView>
    )
}

export default RecoveryPasswordPage

const styles = StyleSheet.create({})