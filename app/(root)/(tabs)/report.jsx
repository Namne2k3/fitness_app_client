import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryRecordCard from '../../../components/HistoryRecordCard'
import ReportComponent from '../../../components/ReportComponent'
import { images } from '../../../constants/image'
import { getTrainingRecord, getTrainingRecordsByMonth, getWeeklyTrainings } from '../../../libs/mongodb'
import { countDataByDaysInMonth, formatDate, getAverageTimeDurationThisWeek, getCurrentMonthDays, getCurrentWeekDays, getTotalTimeDuration } from '../../../utils/index'
import CircularProgress from 'react-native-circular-progress-indicator';
import useUserStore from '../../../store/userStore'
import LoadingModal from '../../../components/LoadingModal'
const screenWidth = Dimensions.get('window').width

const Report = () => {

    const [recordDatas, setRecordDatas] = useState([])
    const [monthRecords, setMonthRecords] = useState([])
    const [weekRecords, setWeekRecords] = useState([])
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0)

    const { user } = useUserStore()
    const { colorScheme } = useColorScheme()
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef();
    const [loading, setLoading] = useState(false)

    const monthDays = getCurrentMonthDays()

    const filteredLabels = monthDays
        .map((day, index) => (index % 2 === 0 ? formatDate(day) : '')); // Chỉ hiển thị nhãn mỗi 3 ngày

    const fetchTrainingRecordsByMonth = async (month) => {
        const data = await getTrainingRecordsByMonth(month)
        setMonthRecords(data)
    }

    const fetchAllTrainingRecord = async () => {
        const res = await getTrainingRecord()
        console.log("Check recordDatas >>> ", res.data);
        setRecordDatas(res.data)
    }

    const fetchAllWeekRecord = async () => {
        const res = await getWeeklyTrainings()

        setWeekRecords(res.data)
        let total = res.data?.reduce((total, record) => {
            return total + record.caloriesBurned;
        }, 0);

        setTotalCaloriesBurned(total)

    }

    const fetchData = async () => {

        setLoading(true);

        try {
            await Promise.all([
                fetchAllWeekRecord(),
                fetchTrainingRecordsByMonth(new Date().getMonth() + 1),
                fetchAllTrainingRecord(),
            ]);

        } catch (error) {

            Alert.alert("Lỗi", error.message)
        }
        finally {
            setLoading(false)
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData()
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <SafeAreaView className="flex h-full dark:bg-slate-950">
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="pt-4 px-4">
                    <Text className="uppercase font-pextrabold text-[32px] dark:text-white">thống kê</Text>
                </View>
                <ReportComponent title={'Mục tiêu'}>
                    <View className="bg-[#fff] rounded-lg mt-2 p-4 w-full dark:bg-[#292727] flex">
                        <View className="flex flex-row">
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Lượng calo cần phải tiêu hao mỗi buổi tập</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.caloriesPerTraining} calo
                                </Text>
                            </View>
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Tổng số ngày để đạt mục tiêu</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.totalDaysToReachTarget} ngày
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row mt-4">
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Số ngày cần luyện tập trong tuần</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.daysShouldTraining} ngày
                                </Text>
                            </View>
                        </View>
                    </View>
                </ReportComponent>
                <ReportComponent title={'Toàn bộ'}>
                    <View className="bg-[#fff] rounded-lg mt-2 p-4 w-full dark:bg-[#292727]" >
                        <View className="flex flex-row ">
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Đã luyện tập</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {recordDatas?.length}
                                </Text>
                            </View>
                            <View className="flex justify-center items-start flex-1">
                                <Text className="text-[13px] font-pmedium dark:text-white">Thời gian (phút)</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {getTotalTimeDuration(recordDatas && recordDatas)}
                                </Text>
                            </View>
                        </View>

                        <View className="mt-2" >
                            <Text className="font-pmedium text-[13px] dark:text-white">Số lần luyện tập trong tuần</Text>

                            <ScrollView
                                nestedScrollEnabled={true}
                                ref={scrollViewRef}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <BarChart
                                    data={{
                                        labels: filteredLabels,
                                        datasets: [
                                            {
                                                data: countDataByDaysInMonth(monthRecords ?? []), // Đảm bảo tất cả ngày đều có dữ liệu
                                            },
                                        ],
                                    }}
                                    width={Math.min(screenWidth * 3, 1000)} // Chiều rộng của biểu đồ
                                    height={220} // Chiều cao của biểu đồ
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        barPercentage: 0.5,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        gridLines: {
                                            drawBorder: false,
                                            drawOnChart: false,
                                            drawTicks: false,
                                        },
                                    }}
                                    showValuesOnTopOfBars={true} // Hiển thị giá trị trên các cột
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />

                            </ScrollView>

                        </View>
                    </View>
                </ReportComponent>

                <ReportComponent title={`tuần này`}>
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
                                <Text className='dark:text-white font-psemibold text-[12px]'>Hôm nay đã tập (lần)</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {
                                        recordDatas?.filter(
                                            (record) => new Date(record.created_at).getDate() === new Date().getDate()
                                        )?.length
                                    }
                                </Text>
                            </View>
                            <View className="flex justify-start items-start flex-1">
                                <Text className='dark:text-white font-psemibold text-[12px]'>Trung bình trong tuần (phút)</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {getAverageTimeDurationThisWeek(recordDatas ?? recordDatas)}
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row">
                            <View className="flex-1 justify-center items-center">
                                <CircularProgress
                                    value={totalCaloriesBurned}
                                    activeStrokeColor='#3749db'
                                    valueSuffix=''
                                    maxValue={user?.caloriesPerTraining * user?.daysShouldTraining}
                                    inActiveStrokeColor='#fff'
                                    title='Calo đã đốt'
                                    titleStyle={{ fontWeight: 'bold' }}
                                />
                            </View>
                            <View className="flex-1 justify-center items-center">
                                <CircularProgress
                                    value={weekRecords?.length}
                                    activeStrokeColor='#3749db'
                                    inActiveStrokeColor='#fff'
                                    valueSuffix={`/${user?.daysShouldTraining}`}
                                    maxValue={user?.daysShouldTraining}
                                    title='Ngày/Tuần'
                                    titleStyle={{ fontWeight: 'bold' }}
                                />
                            </View>
                        </View>
                    </View>
                </ReportComponent>


                <ReportComponent title={`lịch sử`} rightComponent={
                    <TouchableOpacity onPress={() => router.push({
                        pathname: '/(root)/allHistoryRecords',
                        params: {
                            recordDatas: JSON.stringify(recordDatas)
                        }
                    })}>
                        <Text className="text-[#3749db] font-pbold text-lg">Tất cả</Text>
                    </TouchableOpacity>
                }>
                    <View className="rounded-lg p-4 bg-[#fff] dark:bg-[#292727] mt-2">
                        {recordDatas && recordDatas?.length > 0 ? (
                            recordDatas.slice(0, 3).map((item, index) => <HistoryRecordCard key={index} item={item} />)
                        ) : (
                            <View className="flex flex-col items-center justify-center bg-transparent">
                                <Image
                                    source={images.no_result}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMethod="contain"
                                />
                                <Text className="text-sm">Không có lịch sử nào!</Text>
                            </View>
                        )}
                    </View>
                </ReportComponent>
            </ScrollView>
            <LoadingModal visible={loading} />
        </SafeAreaView>
    )
}

export default Report

const styles = StyleSheet.create({})
