import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { scheduleNotificationAsync, cancelAllScheduledNotificationsAsync, cancelScheduledNotificationAsync } from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useState, useCallback } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import CalendarCard from '../../components/CalendarCard';
import CustomButton from '../../components/CustomButton';
import LoadingModal from '../../components/LoadingModal';
import { createCalendarNotify, getCalendars, deleteNotificationById, deleteAllNotificationPassedByUserId } from '../../libs/mongodb';
import usePlanStore from '../../store/usePlanStore';
import useUserStore from '../../store/userStore';
import { getAbbreviation, randomColor } from '../../utils';
import { images } from '../../constants/image';
const CalendarScreen = () => {

    const { colorScheme } = useColorScheme();
    const { plans } = usePlanStore()
    const { data } = useLocalSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [calendars, setCalendars] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const trainings = JSON.parse(data)
    const trainingsInPlans = []

    plans?.forEach((plan) => {
        if (plan?.trainings[plan?.current]?.isInPlan) {
            trainingsInPlans.push({
                ...plan?.trainings[plan?.current],
                planName: plan?.name
            })
        } else {
            trainingsInPlans.push(plan?.trainings[plan?.current])
        }
    })

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await deleteAllNotificationPassed()
        await fetchCalendars()
        setRefreshing(false);
    }, []);

    const { user } = useUserStore()
    const [form, setForm] = useState({
        user: user?._id,
        identifier: "",
        training: "",
        calendarDate: dayjs()
    })
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const schedulePushNotification = async () => {
        setIsLoading(true)
        try {

            if (!form?.training) {
                Alert.alert("Lưu ý", "Vui lòng chọn set tập!");
                return;
            }
            if (!form.calendarDate) {
                Alert.alert('Lưu ý', 'Vui lòng chọn ngày!');
                return;
            }

            const notificationTime = new Date(form.calendarDate);

            if (notificationTime <= new Date()) {
                Alert.alert("Chú ý", "Không thể thiết lập thời gian đã qua!");
                return;
            }

            const notificationId = await scheduleNotificationAsync({
                content: {
                    title: 'Tập luyện thôi nào!',
                    subtitle: `Đã đến lúc tập luyện theo lịch trình của bạn`,
                    body: form?.training?.planName ? `Hôm này là ${form?.training?.title} theo lộ trình ${form?.training?.planName}` : `Hôm nay bạn sẽ tập ${form?.training?.title}`
                },
                trigger: notificationTime
                // trigger: {
                //     seconds: 10
                // }
            });

            setForm((current) => ({
                ...current,
                identifier: notificationId
            }))

            // tao calendar va luu vao db tai day
            const { data } = await createCalendarNotify({
                ...form,
                planName: form?.training?.planName,
                identifier: notificationId
            })

            await deleteAllNotificationPassed()
            await fetchCalendars()
            Alert.alert('Thông báo', `Bạn đã đặt hẹn thông báo tại ${new Date(data?.calendarDate).toLocaleDateString()} ${new Date(data?.calendarDate).toLocaleTimeString()}`);
            // await cancelAllScheduledNotificationsAsync();
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setIsLoading(false)
        }
    };

    const handleDeleteNotification = useCallback(async (item) => {
        try {
            Alert.alert(
                "Xóa hẹn thông báo",
                "Bạn có chắc chắn muốn xóa hẹn thông báo này không?",
                [
                    {
                        text: "Hủy",
                        style: "cancel",
                    },
                    {
                        text: "Xóa",
                        onPress: async () => {

                            await Promise.all([
                                cancelScheduledNotificationAsync(item?.identifier),
                                deleteNotificationById(item?._id)
                            ])

                            await fetchCalendars()
                            Alert.alert("Đã xóa hẹn thông báo!")
                        },
                        style: "destructive",
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Lỗi", error.message);
            return;
        }
    }, [])

    const disablePastDates = (date) => {
        const today = dayjs().startOf('day');
        const selectedDate = dayjs(date);

        return selectedDate.isBefore(today);
    };

    const fetchCalendars = async () => {
        try {
            setIsLoading(true)
            console.log("Fetch calendars ....");
            const res = await getCalendars();
            if (res?.data) {

                setCalendars(res.data)
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteAllNotificationPassed = async () => {
        try {

            await deleteAllNotificationPassedByUserId();

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }
    useEffect(() => {

        deleteAllNotificationPassed()
        fetchCalendars()
    }, [])

    return (
        <SafeAreaView className="flex flex-1 h-full p-4">
            <View className="flex flex-row justify-between items-center pb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                >
                    <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>

                <Text className="text-[28px] font-pextrabold uppercase">Đặt thông báo</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="bg-[#fff] rounded-lg my-2">
                    <Text className="font-pmedium text-lg px-3 pt-3">Các thông báo được thiết lập</Text>
                    <FlatList
                        data={calendars || []} // Dữ liệu của bạn
                        renderItem={({ item }) => <CalendarCard handleDeleteNotification={(item) => handleDeleteNotification(item)} item={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ padding: 12, flexGrow: 1, justifyContent: calendars?.length > 0 ? 'start' : 'center', alignItems: 'center' }}
                        ListEmptyComponent={
                            <View className="flex flex-row items-center justify-center bg-transparent">
                                <Image
                                    source={images.no_result}
                                    className="w-40 h-40"
                                    alt="Không có hẹn thông báo nào được tìm thấy"
                                    resizeMethod="contain"
                                />
                            </View>
                        }
                    />
                </View>

                <View className=" bg-[#fff] rounded-lg my-2">
                    <Text className="font-pmedium text-lg px-3 pt-3">Chọn set tập</Text>
                    <FlatList
                        horizontal
                        data={
                            [
                                ...trainings, ...trainingsInPlans
                            ]
                        }
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={`${item?._id}_${index}`}
                                onPress={() => setForm((current) => ({
                                    ...current,
                                    training: item
                                }))}
                                className={`bg-[#f2f2f2] rounded-lg p-4 mr-3 flex flex-row justify-center items-center ${form?.training?._id == item?._id && 'border-[2px]'}`}
                            >
                                <View className="flex flex-col " >
                                    <Text className="font-pbold text-lg">{item?.title}</Text>
                                    {
                                        item?.planName &&
                                        <Text className="font-pmedium text-[16px] capitalize">{item?.planName}</Text>
                                    }
                                    <Text>6 bài</Text>
                                </View>

                                {
                                    form?.training?._id == item?._id ?
                                        <View className={`ml-4 rounded-full w-[40px] h-[40px] flex justify-center items-center `}>
                                            <Feather name='check' size={40} />
                                        </View>
                                        :
                                        <View className={`ml-4 rounded-full w-[40px] h-[40px] flex justify-center items-center `} style={{ backgroundColor: randomColor() }}>
                                            <Text className="text-white font-pextrabold text-[16px]">{getAbbreviation("Nam ne")}</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            padding: 12,
                            // height: 100,
                            display: "flex",
                        }}
                    />
                </View>

                <View className="my-2 bg-[#fff] rounded-lg p-4 pb-0">
                    <DateTimePicker
                        mode="single"
                        date={form.calendarDate}
                        onChange={({ date }) => {
                            // setDate(date);
                            setForm((current) => ({
                                ...current,
                                calendarDate: date
                            }))
                        }}
                        locale="vi"
                        displayFullDays
                        initialView={'day'}
                        disabledDates={disablePastDates}
                    />
                </View>

                <View className="my-2">
                    <TouchableOpacity className="p-4 bg-[#fff] rounded-lg flex justify-center items-center shadow-lg" onPress={showDatePicker}>
                        {
                            form?.calendarDate != null ? <View>
                                <Text className="font-pmedium text-center text-lg">Thời gian: </Text>
                                <Text className="font-pmedium text-center text-lg">{new Date(form.calendarDate.toString()).toLocaleDateString()} {new Date(form.calendarDate.toString()).toLocaleTimeString()}</Text>
                            </View>
                                :
                                <Text className="font-pmedium text-center text-lg">Chọn ngày và giờ</Text>
                        }
                    </TouchableOpacity>
                </View>



                <View className="my-2 rounded-lg shadow-lg flex">
                    <CustomButton
                        bgColor='bg-[#3749db]'
                        text="Đặt lịch thông báo"
                        onPress={schedulePushNotification}
                    />
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDatePickerVisible}
                onRequestClose={hideDatePicker}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '100%', margin: 20 }}>
                            <DateTimePicker
                                mode="single"
                                date={form.calendarDate}
                                onChange={({ date }) => {
                                    setForm((current) => ({
                                        ...current,
                                        calendarDate: date
                                    }))
                                }}
                                locale={'vi'}
                                displayFullDays
                                initialView={'time'}
                                timePicker
                                disabledDates={disablePastDates}
                            />

                        </View>
                        <View className="mx-9">
                            <CustomButton bgColor='bg-[#3749db]' onPress={() => hideDatePicker()} text="Xác nhận" />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            <LoadingModal visible={isLoading} />
        </SafeAreaView>
    );
};

export default CalendarScreen;
