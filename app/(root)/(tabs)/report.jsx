import { router, useFocusEffect } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryRecordCard from '../../../components/HistoryRecordCard'
import ReportComponent from '../../../components/ReportComponent'
import { images } from '../../../constants/image'
import { getTrainingRecord, getTrainingRecordsByMonth } from '../../../libs/mongodb'
import { useUserStore } from '../../../store'
import { countDataByDaysInMonth, formatDate, getAverageTimeDurationThisWeek, getCurrentMonthDays, getCurrentWeekDays, getTotalTimeDuration } from '../../../utils/index'

const screenWidth = Dimensions.get('window').width

const Report = () => {

    const [monthRecords, setMonthRecords] = useState([])
    const { colorScheme } = useColorScheme()
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [recordDatas, setRecordDatas] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef();
    const user = useUserStore((state) => state.user)
    const [loading, setLoading] = useState(false)

    const monthDays = getCurrentMonthDays()

    const filteredLabels = monthDays
        .map((day, index) => formatDate(day))

    const data = {
        labels: filteredLabels,
        datasets: [{
            data: countDataByDaysInMonth(monthRecords ?? []).map((num) => num)
        }]
    }
    const fetchTrainingRecordsByMonth = async (month) => {
        const data = await getTrainingRecordsByMonth(month, user?._id)
        setMonthRecords(data)
    }

    const fetchAllTrainingRecord = async () => {
        const data = await getTrainingRecord(user?._id)
        setRecordDatas(data)
    }

    const fetchData = async () => {
        setIsVisibleLoadingModal(true)
        try {
            await Promise.all([
                fetchTrainingRecordsByMonth(new Date().getMonth() + 1),
                fetchAllTrainingRecord()
            ]);
            setIsVisibleLoadingModal(false)
            // scrollViewRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            setIsVisibleLoadingModal(false)
            console.error("Error fetching data:", error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            fetchData()
            setRefreshing(false);
        }, 1000);
    }, []);




    return (
        <SafeAreaView className="flex h-full  dark:bg-slate-950">
            <ScrollView
                // className="dark:bg-slate-950"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="pt-4 px-4">
                    <Text className="capitalize font-pextrabold text-[32px] dark:text-white">report</Text>
                </View>
                <ReportComponent title={'Total'}>
                    <View className="bg-[#fff] rounded-lg mt-2 p-4 w-full dark:bg-[#292727]" >
                        <View className="flex flex-row ">
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Workouts</Text>
                                <Text className="text-[#4040d6] font-pextrabold text-[22px]">
                                    {recordDatas?.length}
                                </Text>
                            </View>
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Time(min)</Text>
                                <Text className="text-[#4040d6] font-pextrabold text-[22px]">
                                    {getTotalTimeDuration(recordDatas && recordDatas)}
                                </Text>
                            </View>
                        </View>

                        <View className="mt-2" >
                            <Text className="font-pmedium text-[13px] dark:text-white">Workout times per week</Text>

                            <ScrollView
                                nestedScrollEnabled={true}
                                ref={scrollViewRef}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <LineChart
                                    data={data}
                                    width={screenWidth * 3}
                                    height={220}
                                    chartConfig={{
                                        color: (opacity = 0.5) => colorScheme == 'dark' ? '#fff' : `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    // chartConfig={{
                                    //     backgroundColor: '#e26a00',
                                    //     backgroundGradientFrom: '#fb8c00',
                                    //     backgroundGradientTo: '#ffa726',
                                    //     decimalPlaces: 2, // optional, defaults to 2dp
                                    //     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    //     style: {
                                    //       borderRadius: 16
                                    //     }
                                    //   }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                            </ScrollView>

                        </View>
                    </View>
                </ReportComponent>

                <ReportComponent title={`this week`}>
                    <View className="bg-[#fff] w-full py-2 rounded-lg mt-2 dark:bg-[#292727]">
                        <View className="flex flex-row justify-between items-center px-4 py-2">
                            {
                                getCurrentWeekDays().map((obj, index) => (
                                    <View key={index} className="flex justify-center items-center">
                                        <Text className="mb-3 font-pextrabold text-[#878686]">{obj.day}</Text>
                                        <Text className={` rounded-full bg-[#fafafa] ${obj.index === new Date().getDay() && 'bg-[#000] text-white'} p-2 font-bold`}>{obj.date}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        <View className="p-4 bg-[#fff] flex flex-row dark:bg-[#292727]">
                            <View className="flex justify-start items-start flex-1">
                                <Text className='dark:text-white font-psemibold text-[12px]'>Today(min)</Text>
                                <Text className="text-[#4040d6] font-pextrabold text-[22px]">
                                    {
                                        recordDatas?.filter(
                                            (record) => new Date(record.created_at).getDate() === new Date().getDate()
                                        ).length
                                    }
                                </Text>
                            </View>
                            <View className="flex justify-start items-start flex-1">
                                <Text className='dark:text-white font-psemibold text-[12px]'>Weekly average(min)</Text>
                                <Text className="text-[#4040d6] font-pextrabold text-[22px]">
                                    {getAverageTimeDurationThisWeek(recordDatas && recordDatas)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ReportComponent>


                <ReportComponent title={`History`} rightComponent={
                    <TouchableOpacity onPress={() => router.push('/(root)/allHistoryRecords')}>
                        <Text className="text-[#4040d6] font-psemibold">View All</Text>
                    </TouchableOpacity>
                }>
                    <View className="rounded-lg p-4 bg-[#fff] dark:bg-[#292727]">
                        {
                            recordDatas.length > 0
                                ?
                                recordDatas?.slice(0, 3).map((item, index) => (
                                    <HistoryRecordCard key={index} item={item} />
                                ))
                                :
                                <View className="flex flex-col items-center justify-center bg-transparent">
                                    <Image
                                        source={images.no_result}
                                        className="w-40 h-40"
                                        alt="No recent rides found"
                                        resizeMethod="contain"
                                    />
                                    <Text className="text-sm">No records found!</Text>
                                </View>
                        }
                    </View>
                </ReportComponent>
            </ScrollView>
            {/* <LoadingModal visible={isVisibleLoadingModal} message={"Analyzing Data ..."} /> */}
        </SafeAreaView>
    )
}

export default Report

const styles = StyleSheet.create({})
