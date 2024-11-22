import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import useUserStore from '../../store/userStore'
import { images } from '../../constants/image'
import { router } from 'expo-router'

const bodyPart = [
    'lưng', 'vai', 'tay', 'ngực', 'bụng', 'mông', 'chân', 'toàn thân'
]
const { width } = Dimensions.get('window');
const ChooseFocusBodyPart = () => {
    const user = useUserStore.getState().user;
    const setUser = useUserStore.getState().setUser;
    const [selected, setSelected] = useState([])
    const scrollViewRef = useRef(null)

    const handleSelected = (part) => {
        if (selected.includes(part)) {
            setSelected((current) => (
                current.filter((item) => item != part)
            ))
        } else {
            setSelected((current) => ([
                ...current,
                part
            ]))
            scrollViewRef?.current?.scrollToEnd()
        }
    }

    const handleNext = async () => {
        try {
            if (!selected || selected == []) {
                throw new Error("Bạn phải ít nhất chọn một nhóm cơ!")
            }

            setUser({
                ...user,
                focusBodyPart: selected
            })

            router.push('/(root)/ChooseHeight')
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    return (
        <SafeAreaView className="flex flex-col flex-1 mt-4 h-full bg-[#fff]">
            <View className="px-4 py-2">
                <Text className="font-pbold text-[28px] text-center">Nhóm cơ bạn tập trung xây dựng là gì?</Text>
            </View>

            <View className="flex flex-row flex-wrap w-[80%] mx-auto justify-center items-center mt-4">
                {
                    bodyPart.map((part, index) => {

                        return (
                            <TouchableOpacity
                                key={`${index}_${part}`}
                                onPress={() => handleSelected(part)}
                                className={`rounded-full m-1 border-[1px] border-[#000] p-4 ${selected.includes(part) && 'bg-[#000]'}`}
                            >
                                <Text className={`font-pregular text-[#000] capitalize ${selected.includes(part) && 'text-white'}`}>{part}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <View>
                <ScrollView ref={scrollViewRef} horizontal={true} contentContainerStyle={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {
                        selected.includes('lưng') &&
                        <Image
                            source={images["lưng"]}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    }

                    {
                        selected.includes('vai') &&
                        <Image
                            source={images["vai"]}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    }

                    {
                        selected.includes('tay') &&
                        <View className="flex flex-row">
                            <Image
                                source={images["bắp tay"]}
                                style={{
                                    width: width * 0.5,
                                    height: width * 1,
                                }}
                                resizeMode="cover"
                            />
                            <Image
                                source={images["cẳng tay"]}
                                style={{
                                    width: width * 0.5,
                                    height: width * 1,
                                }}
                                resizeMode="cover"
                            />
                        </View>
                    }

                    {
                        selected.includes('ngực') &&
                        <Image
                            source={images["ngực"]}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    }

                    {
                        selected.includes('bụng') &&
                        <Image
                            source={images.eo}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    }

                    {
                        selected.includes('mông') &&
                        <Image
                            source={images.butt}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    }

                    {
                        selected.includes('chân') &&
                        <View className="flex flex-row">
                            <Image
                                source={images["đùi"]}
                                style={{
                                    width: width * 0.5,
                                    height: width * 1,
                                }}
                                resizeMode="cover"
                            />
                            <Image
                                source={images["cẳng chân"]}
                                style={{
                                    width: width * 0.5,
                                    height: width * 1,
                                }}
                                resizeMode="cover"
                            />
                        </View>
                    }
                </ScrollView>
            </View>

            <View className="absolute bottom-0 m-4">
                <CustomButton text="Tiếp theo" onPress={handleNext} textStyle={{
                    fontFamily: "Roboto-Bold"
                }} />
            </View>
        </SafeAreaView>
    )
}

export default ChooseFocusBodyPart

const styles = StyleSheet.create({
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.8,
        height: width * 1,
        flex: 1,
    },
})