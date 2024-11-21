import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from '../../components/CustomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants/image'
import { router } from 'expo-router'

const OnboardingPage = () => {

    return (
        <>
            <SafeAreaView className="h-full bg-[#fff] px-8 py-10">
                <View className="flex justify-center items-center">
                    <Image
                        source={images.welcome_image}
                        className="w-[300px] h-[300px] rounded-full"
                        resizeMode="contain"
                    />
                </View>
                <View className="mt-8 flex justify-center items-center">
                    <Text className="font-pextrabold text-[32px] text-[#00008B] text-center">Welcome to</Text>
                    <View>
                        <Text className="font-pextrabold text-[32px] text-[#00008B] text-center -mt-4">MyWorkout!</Text>
                    </View>
                    <Text className="font-pmedium text-center">Seed data is simply data that is used to populate a database.</Text>
                </View>
                <View className="flex flex-1 items-center justify-center">
                    <CustomButton text={`Let's Get Start`} onPress={() => router.push('/(auth)/sign-in')} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default OnboardingPage

const styles = StyleSheet.create({})