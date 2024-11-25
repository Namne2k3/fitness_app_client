import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import ExerciseDetailSelectCard from '../../components/ExerciseDetailSelectCard'
import LoadingModal from '../../components/LoadingModal'
import { createCustomTrainings, getAllExercisesBySearchQueryName } from '../../libs/mongodb'
import { useUserStore } from '../../store';
import { images } from '../../constants/image'
import BottomSheetModalComponent from '../../components/BottomSheetModal';
import { useColorScheme } from 'nativewind';

const CreateExercisePage = () => {


    const [searchQuery, onChangeSearchQuery] = useState('')
    const [smallLoading, setSmallLoading] = useState(false)
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [exercises, setExercises] = useState([])
    const [exerciseSelections, setExerciseSelections] = useState([])
    const [selectedExercise, setSelectedExercise] = useState({})
    const bottomSheetRef = useRef(null)
    const user = useUserStore((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const { colorScheme } = useColorScheme()
    const [skip, setSkip] = useState(0)
    const limit = 10

    const [trainingData, setTrainingData] = useState({
        title: 'Bài tập mới',
        exercises: [

        ],
        user: user?._id
    })

    const handleAddExerciseToSelection = useCallback((exercise) => {
        if (!exerciseSelections.some((ex) => ex.id === exercise.id)) {
            setExerciseSelections((prev) => [...prev, exercise]);
        } else {
            setExerciseSelections(
                (prev) => prev.filter((ex) => ex.id !== exercise.id) // Sử dụng `id` hoặc thuộc tính bạn đang sử dụng
            );
        }
    }, [exerciseSelections]);

    const handleSaveAddExerciseToTraining = useCallback(async () => {
        setIsVisibleLoadingModal(true)
        try {
            let updatedTrainingData = JSON.parse(JSON.stringify(trainingData));
            exerciseSelections.map((ex, index) => {
                const existingExercise = updatedTrainingData.exercises.find(
                    (item) => item.exercise.id === ex.id
                );

                if (!existingExercise) {
                    updatedTrainingData.exercises.push({
                        exercise: {
                            ...ex
                        },
                        sets: [
                            {
                                kilogram: 0,
                                reps: 12
                            }
                        ]
                    })
                }
            })
            await createCustomTrainings({
                ...updatedTrainingData,
                isCustom: true
            })
            setTrainingData((previous) => ({
                title: 'New Training',
                exercises: [

                ],
                user: user?._id
            }))

            setIsVisibleLoadingModal(false)
            router.replace('/(root)/(tabs)/custom')
            Alert.alert("Đã tạo set bài tập mới!")

        } catch (error) {
            setIsVisibleLoadingModal(false)
            console.log("Error: ", error);

        }
    })

    const handlePresentModalSheet = useCallback((item) => {
        bottomSheetRef.current?.present()
        setSelectedExercise(item)
    })

    const fetchDataByQuery = async (isSearchReset = false) => {
        setSmallLoading(true)
        try {
            if (isSearchReset) {
                setIsLoading(true); // Hiển thị loader cho tìm kiếm mới
                setSkip(0); // Đặt lại skip
                setExercises([]); // Xóa danh sách hiện tại
            }

            const res = await getAllExercisesBySearchQueryName(searchQuery || "", { limit, skip: isSearchReset ? 0 : skip });
            if (res.status === '404') {
                console.log("Gặp lỗi 404");
                return;
            }

            const newExercises = res.data;
            setExercises((prevExercises) => isSearchReset ? newExercises : [...prevExercises, ...newExercises]);

            if (newExercises.length > 0) {
                setSkip((prevSkip) => prevSkip + limit);
            }
        } catch (error) {
            console.log("Error fetching training data:", error);
        } finally {
            setSmallLoading(false)
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchDataByQuery(true); // Thực hiện tìm nạp dữ liệu sau 1 giây
        }, 1000); // Thời gian debounce: 1 giây

        return () => clearTimeout(debounceTimeout); // Xóa timeout nếu người dùng tiếp tục nhập
    }, [searchQuery]);

    return (
        <>
            <SafeAreaView className=" h-full relative dark:bg-slate-950">

                <View className="flex flex-row justify-between items-center px-4 my-2">
                    <View>
                        <TouchableOpacity onPress={() => router.back()}>
                            <AntDesign name='arrowleft' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex flex-row p-2 bg-[#ccc] rounded-lg" >
                        <View className="flex justify-center items-center mr-2">
                            <Feather name='edit-3' size={24} />
                        </View>
                        <TextInput
                            className="rounded-lg font-pextrabold text-lg"
                            style={{
                                color: "#000"
                            }}
                            value={trainingData.title}
                            onChangeText={(text) => setTrainingData({ ...trainingData, title: text })}
                        />
                    </View>
                </View>

                <View className="p-4">
                    <View className="shadow-lg flex flex-row justify-between items-center mb-2">
                        <TextInput
                            className="p-3 rounded-lg bg-[#f4f5f6] flex-1 dark:bg-[#000] dark:border-[0.5px] dark:border-[#fff] dark:text-white"
                            color={'#000'}
                            value={searchQuery}
                            placeholder='Tìm kiếm tên bài tập'
                            onChangeText={onChangeSearchQuery}
                        />

                    </View>
                    {
                        isLoading ? (
                            <View className="h-full flex justify-center items-center">
                                <ActivityIndicator color={colorScheme == 'dark' ? '#fff' : '#000'} size={'large'} />
                            </View>
                        ) : (
                            <FlatList
                                data={exercises}
                                renderItem={({ item }) => (
                                    <ExerciseDetailSelectCard
                                        colorScheme={colorScheme}
                                        exerciseSelections={exerciseSelections}
                                        exercise={item}
                                        handleAddExerciseToSelection={(ex) => handleAddExerciseToSelection(ex)}
                                        handlePresentModalSheet={handlePresentModalSheet}
                                    />
                                )}
                                ItemSeparatorComponent={() =>
                                    <View className="h-[16px] dark:bg-slate-950" />
                                }
                                ListFooterComponent={
                                    !smallLoading ?
                                        <TouchableOpacity className='p-4 flex flex-row justify-center items-center' onPress={() => fetchDataByQuery(false)}>
                                            <Ionicons name='reload' size={30} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>
                                        :
                                        <ActivityIndicator size={'large'} animating={smallLoading} style={{ marginTop: 12 }} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                }
                                ListEmptyComponent={() => (
                                    <View className="flex flex-col items-center justify-center bg-transparent">
                                        <Image
                                            source={images.no_result}
                                            className="w-40 h-40"
                                            alt="No recent rides found"
                                            resizeMethod="contain"
                                        />
                                        <Text className="text-sm">No exercises found!</Text>
                                    </View>
                                )}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: 210,
                                    marginTop: 12
                                }}
                            />
                        )
                    }
                </View>
                <View className="absolute bottom-0 m-4">
                    <CustomButton text="Tạo mới" onPress={handleSaveAddExerciseToTraining} />
                </View>
                <BottomSheetModalComponent bottomSheetRef={bottomSheetRef} selectedExercise={selectedExercise} />
                <LoadingModal visible={isVisibleLoadingModal} />
            </SafeAreaView>
        </>
    )
}

export default CreateExercisePage

const styles = StyleSheet.create({})