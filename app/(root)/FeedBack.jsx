import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import LoadingModal from '../../components/LoadingModal'
import { createFeedback } from '../../libs/mongodb'
import { useUserStore } from '../../store'
const FeedBack = () => {

    const user = useUserStore((state) => state.user)
    const [content, setContent] = useState('')
    const { colorScheme } = useColorScheme()
    const [isVisibleModalLoading, setIsVisibleModalLoading] = useState(false)

    const handleSendFeedback = useCallback(async () => {
        setIsVisibleModalLoading(true)
        try {
            if (!content) {
                throw new Error("Bạn chưa điền phản hồi!")
            }
            await createFeedback({
                user: user?._id,
                content: content ? content : '',
                rate: null
            })
            setIsVisibleModalLoading(false)
            Alert.alert('Phản hồi của bạn đã được gửi đi!')
            router.replace('/(root)/me')

        } catch (error) {
            setIsVisibleModalLoading(false)
            Alert.alert('Lỗi', error.message || 'Mỗi lỗi không xác định đã xảy ra') // Chuyển đổi đối tượng lỗi thành chuỗi
        }
    })

    return (
        <>
            <SafeAreaView className="flex relative dark:bg-slate-950 p-4 h-full pb-[100px]">
                <View className="flex flex-row justify-start items-center mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} style={{ paddingRight: 12, marginRight: 12 }} />
                    </TouchableOpacity>
                    <Text className="font-pextrabold text-[24px] dark:text-white">Phản hồi</Text>
                </View>
                <ScrollView className="bg-[#fff] dark:bg-[#292727] flex-1 rounded-lg" showsVerticalScrollIndicator={false}>
                    <TextInput
                        style={{
                            color: colorScheme == 'dark' ? '#fff' : '#000',
                            maxWidth: '100%',
                            padding: 10,
                        }}
                        placeholder='Phản hồi hoặc đề xuất gợi ý'
                        placeholderTextColor="#ccc"
                        multiline={true}
                        textAlignVertical="top"
                        value={content}
                        onChangeText={setContent}
                    />
                </ScrollView>
            </SafeAreaView>
            <View className="absolute bottom-0 left-0 right-0 m-4">
                <CustomButton
                    text="Gửi"
                    onPress={() => handleSendFeedback()}
                />
            </View>
            <LoadingModal visible={isVisibleModalLoading} message="Chúng tôi đang gửi phản hồi của bạn..." />
        </>
    )
}

export default FeedBack

const styles = StyleSheet.create({})