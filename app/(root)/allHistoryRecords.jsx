import { Feather, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryRecordCard from '../../components/HistoryRecordCard'
import { images } from '../../constants/image'
import { getTrainingRecord } from '../../libs/mongodb'
const AllHistoryRecords = () => {

    const [recordDatas, setRecordDatas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [smallLoading, setSmallLoading] = useState(false)
    const { colorScheme } = useColorScheme()
    const [skip, setSkip] = useState(0)
    const limit = 10

    const fetchAllTrainingRecord = async (isSearchReset = false) => {
        if (!isSearchReset) setSmallLoading(true)
        try {

            if (isSearchReset) {
                setIsLoading(true)
                setSkip(0)
                setRecordDatas([])
            }

            const res = await getTrainingRecord({ limit, skip: isSearchReset ? 0 : skip });

            const newRecordDatas = res.data;
            setRecordDatas((current) => isSearchReset ? newRecordDatas : [...current, ...newRecordDatas])

            if (newRecordDatas?.length > 0) {
                setSkip((prev) => prev + limit)
            }

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setSmallLoading(false)
            setIsLoading(false)
        }
    };
    useEffect(() => {
        fetchAllTrainingRecord(true)
    }, []);

    return (
        <SafeAreaView className="h-full relative dark:bg-slate-950 p-4">

            <View className=" w-full flex flex-row justify-between items-center">
                <View className="flex flex-row justify-center items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <Text className="ml-4 font-pextrabold uppercase text-[28px] dark:text-white">Lịch sử tập luyện</Text>
                </View>
            </View>
            {
                isLoading ? (
                    <View className="h-full flex justify-center items-center">
                        <ActivityIndicator color={"#000"} size={'large'} />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={recordDatas}
                            renderItem={({ item }) => (
                                <HistoryRecordCard item={item} />
                            )}
                            ListEmptyComponent={() => (
                                <View className="flex flex-col items-center justify-center bg-transparent h-full">
                                    <Image
                                        source={images.no_result}
                                        className="w-40 h-40"
                                        alt="No recent rides found"
                                        resizeMethod="contain"
                                    />
                                    <Text className="text-sm">Chưa có lịch sử tập luyện!</Text>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingVertical: 16,
                            }}
                            ListFooterComponent={
                                !smallLoading ?
                                    <TouchableOpacity onPress={() => fetchAllTrainingRecord(false)} className='p-4 flex flex-row justify-center items-center'>
                                        <Ionicons name='reload' size={30} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                    </TouchableOpacity>
                                    :
                                    <ActivityIndicator size={'large'} animating={smallLoading} style={{ marginTop: 12 }} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            }
                        />
                    </>
                )
            }
        </SafeAreaView>
    )
}

export default AllHistoryRecords