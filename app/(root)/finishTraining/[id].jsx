import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/CustomButton'
import { images } from '../../../constants/image'
import { getTrainingRecordById } from '../../../libs/mongodb'
import { formatDateWithMonth, formatTime } from '../../../utils/index'
const FinishTrainingId = () => {

    const { id } = useLocalSearchParams()
    const [trainingRecord, setTrainingRecord] = useState({})

    useEffect(() => {
        const fetchTrainingRecordById = async () => {
            const data = await getTrainingRecordById(id)

            setTrainingRecord(data)
        }

        fetchTrainingRecordById()
    }, [])


    return (
        <SafeAreaView className="h-full bg-[#4040d6]">
            <View className="flex flex-row p-4 mt-4">

                <View className="flex-1 justify-center z-10">
                    <Text className="text-white font-pmedium text-[18px]">Congratulations!</Text>
                    <Text className="text-white font-pextrabold uppercase text-[24px]">your workout is completed!</Text>
                </View>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: -30,
                }}>

                    <View style={{
                        width: 300,
                        height: 300,
                        backgroundColor: '#4040d6',
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 30,
                        position: 'absolute',
                        elevation: 8,
                    }} className="rounded-full" />

                    <View style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#4040d6',
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 30,
                        position: 'absolute',
                        elevation: 8,
                    }} className="rounded-full" />

                    <View style={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#4040d6',
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 30,
                        position: 'absolute',
                        elevation: 8
                    }} className="rounded-full" />

                    <Image
                        source={images.golden_cup}
                        contentFit="contain"
                        style={{
                            width: 100,
                            height: 100,
                            transform: [{ rotate: '20deg' }]
                        }}
                    />
                </View>
            </View>

            <View className="flex flex-1 bg-[#fff] rounded-t-[16px] p-4">
                <View className="flex justify-center items-start border-b-[1px] pb-3 border-[#ccc]">
                    <Text className="text-black font-pextrabold text-[24px]">{trainingRecord?.training?.title}</Text>
                    <View className="flex flex-row mt-2 justify-between">
                        <View className="flex-1">
                            <Text className="text-lg font-psemibold">{`${trainingRecord?.duration}`}</Text>
                            <Text className="text-md mt-[-6px] font-pmedium">Duration</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-psemibold">{`${formatDateWithMonth(trainingRecord?.created_at)}`}</Text>
                            <Text className="text-md mt-[-6px] font-pmedium">{formatTime(trainingRecord?.created_at)}</Text>
                        </View>

                    </View>
                    <View className="">
                        <Text className="text-lg font-psemibold">{`Burned Calories`}</Text>
                        <Text className="text-md mt-[-6px] font-pmedium">{trainingRecord?.caloriesBurned} calories</Text>
                    </View>
                </View>


                <FlatList
                    data={trainingRecord?.training?.exercises}
                    renderItem={({ item }) => (
                        <View className="mb-4">
                            <Text className="capitalize font-pextrabold text-lg">{item?.exercise?.name}</Text>
                            <Text className="font-psemibold text-md text-black capitalize">{item?.sets?.length} set</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 100,
                        paddingTop: 12
                    }}
                />


                <View className="absolute bottom-0 left-0 right-0 m-4">
                    <CustomButton
                        text="Done"
                        bgColor='bg-[#4040d6]'
                        onPress={() => router.replace('/(root)/(tabs)/report')}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default FinishTrainingId

const styles = StyleSheet.create({})