import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import CircularProgress from 'react-native-circular-progress-indicator'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryRecordCard from '../../../components/HistoryRecordCard'
import LoadingModal from '../../../components/LoadingModal'
import ReportComponent from '../../../components/ReportComponent'
import { images } from '../../../constants/image'
import { getTrainingRecord, getTrainingRecordsByMonth, getWeeklyTrainings } from '../../../libs/mongodb'
import useUserStore from '../../../store/userStore'
import { countDataByDaysInMonth, formatDate, getAverageTimeDurationThisWeek, getCurrentMonthDays, getCurrentWeekDays, getTotalTimeDuration } from '../../../utils/index'
import { useSelector } from 'react-redux'
import { selectGetUser } from '../../../store/userReduxData/UserReduxSelectors'
const screenWidth = Dimensions.get('window').width

const Report = () => {

    const [recordDatas, setRecordDatas] = useState([])
    const [monthRecords, setMonthRecords] = useState([])
    const [weekRecords, setWeekRecords] = useState([])
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0)
    // const { user } = useUserStore()
    const user = useSelector(selectGetUser)
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef();
    const [loading, setLoading] = useState(false)
    const [skip, setSkip] = useState(0)
    const limit = 10
    const monthDays = getCurrentMonthDays()

    const filteredLabels = monthDays
        .map((day, index) => (index % 2 === 0 ? formatDate(day) : '')); // Chỉ hiển thị nhãn mỗi 3 ngày

    const fetchTrainingRecordsByMonth = async (month) => {
        const data = await getTrainingRecordsByMonth(month)
        setMonthRecords(data)
    }

    const fetchAllTrainingRecord = async (isSearchReset = false) => {
        try {

            if (isSearchReset) {
                // setLoading(true)
                setSkip(0)
                setRecordDatas([])
            }

            const res = await getTrainingRecord({ limit: 0, skip: isSearchReset ? 0 : skip });

            const newRecordDatas = res.data;
            setRecordDatas((current) => isSearchReset ? newRecordDatas : [...current, ...newRecordDatas])

            if (newRecordDatas?.length > 0) {
                setSkip((prev) => prev + limit)
            }

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setLoading(false)
        }
    };

    const fetchAllWeekRecord = async () => {
        const res = await getWeeklyTrainings()

        setWeekRecords(res.data)
        let total = res.data?.reduce((total, record) => {
            return total + record.caloriesBurned;
        }, 0);

        setTotalCaloriesBurned(Number(total).toFixed(2))

    }

    const fetchData = async () => {

        try {
            await Promise.all([
                fetchAllWeekRecord(),
                fetchTrainingRecordsByMonth(new Date().getMonth() + 1),
                fetchAllTrainingRecord(true),
            ]);

        } catch (error) {

            console.log("Lỗi", error.message)
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
                            <View className="flex justify-start items-start flex-[0.9]">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Lượng calo cần phải tiêu hao mỗi buổi tập</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.caloriesPerTraining} calo
                                </Text>
                            </View>
                            <View className="flex justify-start items-start flex-1">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Tổng số ngày để đạt mục tiêu</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.totalDaysToReachTarget} ngày
                                </Text>
                            </View>
                        </View>

                        <View className="flex flex-row mt-4">
                            <View className="flex justify-start items-start flex-[0.9]">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Số ngày cần luyện tập trong tuần</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.daysShouldTraining} ngày
                                </Text>
                            </View>
                            <View className="flex justify-start items-start flex-1">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Lượng protein cần thiết (mỗi ngày)</Text>
                                <Text className="text-[#3749db] font-pextrabold text-[26px]">
                                    {user?.proteinRequirement}g
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row mt-4">
                            <View className="flex justify-start items-start flex-1">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Phân phối calo theo bữa</Text>
                                <View className="flex w-[90%] mt-2">
                                    <View className="flex flex-row justify-between items-center">
                                        <Text className="font-pmedium dark:text-white">Bữa sáng:</Text>
                                        <Text className="font-pbold text-[#3749db]"> {user?.mealDistribution?.breakfast} g</Text>
                                    </View>
                                    <View className="flex flex-row justify-between items-center">
                                        <Text className="font-pmedium dark:text-white">Bữa trưa:</Text>
                                        <Text className="font-pbold text-[#3749db]"> {user?.mealDistribution?.lunch} g</Text>
                                    </View>
                                    <View className="flex flex-row justify-between items-center">
                                        <Text className="font-pmedium dark:text-white">Bữa tối:</Text>
                                        <Text className="font-pbold text-[#3749db]"> {user?.mealDistribution?.dinner} g</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex justify-start items-start flex-[0.9]">
                                <Text className="text-[13px] font-pbold dark:text-white flex-1">Lượng chất béo cần thiết (mỗi ngày)</Text>
                                <Text className="text-[#3749db] font-pbold text-[26px]">
                                    {user?.fatRequirement}g
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
                                        }
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
                                    inActiveStrokeColor='#f5f5f5'
                                    title='Calo đã đốt'
                                    titleStyle={{ fontWeight: 'bold' }}
                                />
                            </View>
                            <View className="flex-1 justify-center items-center">
                                <CircularProgress
                                    value={weekRecords?.length}
                                    activeStrokeColor='#3749db'
                                    inActiveStrokeColor='#f5f5f5'
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
                    <TouchableOpacity onPress={() => router.push('/(root)/allHistoryRecords')}>
                        <Text className="text-[#3749db] font-pbold text-lg">Tất cả</Text>
                    </TouchableOpacity>
                }>
                    <View className="rounded-lgbg-[#fff] dark:bg-[#292727] mt-2">
                        {recordDatas && recordDatas?.length > 0 ? (
                            recordDatas.slice(0, 3).map((item, index) => <HistoryRecordCard key={index} item={item} />)
                        ) : (
                            <View className="flex mb flex-col items-center justify-center bg-transparent">
                                <Image
                                    source={images.no_result}
                                    className="w-40 h-40"
                                    contentFit="contain"
                                />
                                <Text className="text-sm">Chưa có lịch sử tập luyện!</Text>
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
