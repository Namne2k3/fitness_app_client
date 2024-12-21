import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { images } from '../../constants/image';
import useUserStore from '../../store/userStore';
const { width } = Dimensions.get('window');

const ChooseGender = () => {
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const [gen, setGen] = useState("")

    const setGender = async (gender) => {
        setGen(gender)
        setUser({
            ...user,
            gender: gender
        })
    }

    const handleNext = async () => {
        try {
            if (!gen) {
                throw new Error("Bạn phải chọn giới tính!")
            }
            router.push('/(root)/ChooseGoal')
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    return (
        <SafeAreaView className="flex flex-col flex-1 mt-4 h-full bg-[#fff]">

            <View>
                <Text className="font-pbold text-[28px] text-center">Giới tính của bạn</Text>
            </View>

            <View style={styles.genderContainer}>
                <TouchableOpacity onPress={() => setGender('male')} style={styles.imageContainer}>
                    <Image
                        source={images["3d_male"]}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setGender('female')} style={styles.imageContainer}>
                    <Image
                        source={images["3d_female"]}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </TouchableOpacity>

            </View>
            <View className="flex flex-row justify-around items-center my-6">
                <TouchableOpacity>
                    <Text className="font-pextrabold text-lg">Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className="font-pextrabold text-lg">Nữ</Text>
                </TouchableOpacity>
            </View>
            <View className="flex flex-row justify-around items-center my-2">
                <TouchableOpacity onPress={() => setGender('male')}>
                    <AntDesign name={gen == 'male' ? 'checkcircle' : 'checkcircleo'} size={28} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setGender('female')}>
                    <AntDesign name={gen == 'female' ? 'checkcircle' : 'checkcircleo'} size={28} />
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 m-4 ">
                <CustomButton bgColor='bg-[#3749db]' onPress={handleNext} text="Tiếp theo" textStyle={{
                    fontFamily: "Roboto-Bold"
                }} />
            </View>
        </SafeAreaView >
    );
};

export default ChooseGender;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.4,
        height: width * 0.9,

    },
});
