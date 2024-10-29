import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getTrainingRecord } from '../../libs/mongodb'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import HistoryRecordCard from '../../components/HistoryRecordCard'
import { useUserStore } from '../../store'
import { images } from '../../constants/image'
import { useColorScheme } from 'nativewind'
const AllHistoryRecords = () => {

    const [recordDatas, setRecordDatas] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const { colorScheme } = useColorScheme()

    const user = useUserStore((state) => state.user)

    const [offset, setOffset] = useState(0)

    const handleRefresh = useCallback(async () => {
        setOffset(0)
        await fetchAllTrainingRecord()
    })

    const fetchAllTrainingRecord = async () => {
        const data = await getTrainingRecord(user?._id);
        setRecordDatas(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllTrainingRecord();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView className="h-full relative bg-[#fff] dark:bg-slate-950">

            <View className="px-4 w-full flex flex-row justify-between items-center">
                <View className="flex flex-row justify-center items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <Text className="ml-4 font-pextrabold uppercase text-[32px] dark:text-white">History</Text>
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
                            data={recordDatas?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))}
                            renderItem={({ item }) => (
                                <HistoryRecordCard item={item} />
                            )}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                            }
                            ListEmptyComponent={() => (
                                <View className="flex flex-col items-center justify-center bg-transparent h-full">
                                    <Image
                                        source={images.no_result}
                                        className="w-40 h-40"
                                        alt="No recent rides found"
                                        resizeMethod="contain"
                                    />
                                    <Text className="text-sm">No records found!</Text>
                                </View>
                            )}
                            contentContainerStyle={{
                                borderRadius: 16,
                                padding: 16,
                                backgroundColor: colorScheme == 'dark' ? '#292727' : '#fff',
                                paddingBottom: 100
                            }}
                        />
                    </>
                )
            }
        </SafeAreaView>
    )
}

export default AllHistoryRecords

const styles = StyleSheet.create({})