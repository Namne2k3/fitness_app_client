import { Feather } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/CustomButton'
import TrainingCard from '../../../components/TrainingCard'
import { fetchTrainingById, updateTraining } from '../../../libs/mongodb'
import { useColorScheme } from 'nativewind'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import LoadingModal from '../../../components/LoadingModal'
const EditCustomTraining = () => {

    const { id, data } = useLocalSearchParams()
    const parsed = JSON.parse(data)
    const [isLoading, setIsLoading] = useState(false)
    const [dataTraining, setDataTraining] = useState(JSON.parse(parsed))
    const { colorScheme } = useColorScheme()
    const bottomSheetRef = useRef(null)
    const [selectedExercise, setSelectedExercise] = useState({})

    const toggleBottomSheetModal = useCallback((ex) => {
        setSelectedExercise(ex)
        bottomSheetRef?.current?.present()
    }, [])

    const handleAddSet = useCallback((item) => {
        setDataTraining(prevTrainings => {
            const updatedTrainings = prevTrainings.exercises.map(exercise => {
                if (exercise === item) {
                    // Tạo bản sao mới của sets và thêm một set mới
                    const updatedSets = [...exercise.sets, { kilogram: 0, reps: 1 }];
                    return {
                        ...exercise,
                        sets: updatedSets // Gán lại mảng sets mới
                    };
                }
                return exercise; // Giữ nguyên các bài tập không thay đổi
            });

            return {
                ...prevTrainings, // Giữ lại các thuộc tính khác của prevTrainings
                exercises: updatedTrainings // Gán lại mảng exercises đã cập nhật
            };
        });
    }, [setDataTraining]);


    const handleRemoveLastSet = useCallback((item) => {
        setDataTraining(prevTrainings => {
            // Duyệt qua các bài tập và cập nhật bài tập tương ứng
            const updatedTrainings = prevTrainings.exercises.map(exercise => {
                if (exercise === item) {
                    // Kiểm tra xem có nhiều hơn 1 set để xóa
                    if (exercise.sets.length > 1) {
                        // Sao chép mảng sets và loại bỏ set cuối cùng
                        const updatedSets = exercise.sets.slice(0, -1);
                        return {
                            ...exercise,
                            sets: updatedSets // Gán lại sets đã cập nhật
                        };
                    }
                }
                return exercise; // Giữ nguyên các bài tập không thay đổi
            });

            // Trả về dữ liệu mới với các bài tập đã cập nhật
            return {
                ...prevTrainings, // Giữ nguyên các thuộc tính khác của prevTrainings
                exercises: updatedTrainings // Gán lại mảng exercises đã cập nhật
            };
        });
    }, [setDataTraining]);


    const handleUpdateKilogramAndReps = useCallback(async (item, index, newKilo, newReps) => {

        setDataTraining(prevData => {

            const updatedExercises = prevData.exercises.map(exercise => {

                if (exercise.exercise.id === item.exercise.id) {

                    const updatedSets = exercise.sets.map((set, setIndex) => {
                        if (setIndex === index) {
                            return { kilogram: newKilo, reps: newReps };
                        }
                        return set;
                    });
                    return { ...exercise, sets: updatedSets };
                }
                return exercise;
            });


            return { ...prevData, exercises: updatedExercises };
        });
    }, [setDataTraining]);


    const handleSaveEditTraining = async () => {
        setIsLoading(true)
        try {
            const savedData = await updateTraining(dataTraining);


            if (savedData) {
                router.replace(`/(root)/(tabs)/custom`)
            }
        } catch (error) {
            Alert.alert('Error: ', error.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await fetchTrainingById(id);
    //         console.log("Check data fetching >>> ", data);

    //         setDataTraining(data)
    //     }

    //     fetchData()
    // }, [])

    return (
        <SafeAreaView className="h-full relative dark:bg-slate-950">
            <View className="p-4 w-full flex flex-row justify-between items-center">
                <View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View className="flex items-center justify-between flex-row bg-[#ccc] rounded-lg px-4">
                    <View className="">
                        <Feather name='edit-3' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </View>
                    <View>
                        <TextInput
                            onChangeText={(text) => setDataTraining({
                                ...dataTraining,
                                title: text
                            })}
                            value={dataTraining?.title}
                            className="text-[#000] dark:text-white font-pbold text-left text-[18px]"
                        />
                    </View>
                </View>
            </View>


            <FlatList
                data={dataTraining?.exercises}
                renderItem={({ item }) => (
                    <View className="bg-[#fff] flex p-4">
                        <TrainingCard
                            toggleBottomSheetModal={(ex) => toggleBottomSheetModal(ex)}
                            handleUpdateKilogramAndReps={handleUpdateKilogramAndReps}
                            item={item}
                        />
                        <View className="flex flex-row justify-between items-center">
                            <CustomButton
                                containerStyle="mt-4 flex-1 mr-2 border-[1px] border-[#000]"
                                textStyle={{ color: 'black' }}
                                bgColor='#fff'
                                text="-"
                                onPress={() => handleRemoveLastSet(item)}
                            />
                            <CustomButton
                                containerStyle="mt-4 flex-1 ml-2 border-[1px] border-[#000]"
                                textStyle={{ color: 'black' }}
                                bgColor='#fff'
                                text="+"
                                onPress={() => handleAddSet(item)}
                            />
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View className="h-[16px]" />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 80
                }}
            />


            <View className="absolute bottom-0 left-0 right-0 m-4">
                <CustomButton
                    bgColor='bg-[#3749db]'
                    text="Lưu"
                    onPress={handleSaveEditTraining}
                />
            </View>

            <BottomSheetModalComponent selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
            <LoadingModal visible={isLoading} />
        </SafeAreaView>
    )
}

export default EditCustomTraining

const styles = StyleSheet.create({})