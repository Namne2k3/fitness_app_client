import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Image, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import ExerciseDetailSelectCard from '../../components/ExerciseDetailSelectCard'
import { fetchExerciseByQuery } from '../../libs/exerciseDb'
import LoadingModal from '../../components/LoadingModal'
import { createTrainings } from '../../libs/mongodb'
import { useUserStore } from '../../store';
import { images } from '../../constants/image'
import BottomSheetModalComponent from '../../components/BottomSheetModal';

const CreateExercisePage = () => {


    const [searchQuery, onChangeSearchQuery] = useState('')
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)
    const [exercises, setExercises] = useState([])
    const [exerciseSelections, setExerciseSelections] = useState([])
    const [selectedExercise, setSelectedExercise] = useState({})
    const bottomSheetRef = useRef(null)
    const user = useUserStore((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)

    const [trainingData, setTrainingData] = useState({
        title: 'New Training',
        exercises: [

        ],
        user: user?._id
    })

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
                                reps: 1
                            }
                        ]
                    })
                }
            })
            await createTrainings(updatedTrainingData)
            setTrainingData((previous) => ({
                title: 'New Training',
                exercises: [

                ],
                user: user?._id
            }))

            setIsVisibleLoadingModal(false)
            router.replace('/(root)/(tabs)/custom')
            Alert.alert("New Training has been created!")

        } catch (error) {
            setIsVisibleLoadingModal(false)
            console.log("Error: ", error);

        }
    })

    const handlePresentModalSheet = useCallback((item) => {
        bottomSheetRef.current?.present()
        setSelectedExercise(item)
    })



    useEffect(() => {
        const fetchDataByQuery = async () => {
            try {
                const searchData = await fetchExerciseByQuery(searchQuery.toLowerCase())
                if (searchData) {
                    setExercises(searchData);
                }
            } catch (error) {
                console.log(error);

            } finally {
                setIsLoading(false)
            }
        }

        setTimeout(async () => {
            await fetchDataByQuery()
        }, 500)
    }, [searchQuery])

    return (
        <>
            <SafeAreaView className="bg-[#fff] h-full relative">

                <View className="flex flex-row justify-between items-center px-4 my-2">
                    <View>
                        <TouchableOpacity onPress={() => router.back()}>
                            <AntDesign name='arrowleft' size={24} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex flex-row p-2 bg-[#ccc] rounded-lg" >
                        <TextInput
                            className="rounded-lg font-pextrabold text-lg"
                            style={{
                                color: "#000"
                            }}
                            value={trainingData.title}
                            onChangeText={(text) => setTrainingData({ ...trainingData, title: text })}
                        />
                        <View className="flex justify-center items-center ml-2">
                            <Feather name='edit-3' size={24} />
                        </View>
                    </View>
                </View>

                <View className="p-4">
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-[#f4f5f6] flex-1"
                            color={'#000'}
                            value={searchQuery}
                            placeholder='Search for exercises...'
                            onChangeText={onChangeSearchQuery}
                        />
                        <View className="ml-2">
                            <CustomButton text="Save" onPress={handleSaveAddExerciseToTraining} />
                        </View>
                    </View>
                    {
                        isLoading ? (
                            <View className="h-full flex justify-center items-center">
                                <ActivityIndicator color={"#000"} size={'large'} />
                            </View>
                        ) : (
                            <FlatList
                                data={exercises}
                                renderItem={({ item }) => (
                                    <ExerciseDetailSelectCard
                                        exerciseSelections={exerciseSelections}
                                        exercise={item}
                                        setExerciseSelections={setExerciseSelections}
                                        handlePresentModalSheet={handlePresentModalSheet}
                                    />
                                )}
                                ItemSeparatorComponent={() =>
                                    <View className="h-[10px] bg-[#fff]" />
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
                                    paddingBottom: 132,
                                    marginTop: 12
                                }}
                            />
                        )
                    }
                </View>
                {/* <BottomSheetModalProvider>

                    <BottomSheetModal
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={['65%', '90%']}
                        stackBehavior='replace'
                        enableDismissOnClose={true}
                        style={{
                            borderRadius: 12,
                            zIndex: 100
                        }}
                    >
                        <BottomSheetScrollView
                            horizontal={false}
                            contentContainerStyle={{
                                padding: 16,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="flex justify-center items-center rounded-lg">
                                <Image
                                    source={{
                                        uri: selectedExercise?.gifUrl
                                    }}
                                    className="w-full min-h-[300px]"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="font-pextrabold text-lg capitalize mt-4">{selectedExercise?.name}</Text>
                            <Text className="font-pbold text-lg mt-2">
                                Target: <Text className="font-pregular">{selectedExercise?.target} {selectedExercise?.secondaryMuscles?.map((mus, index) =>
                                    <Text key={index}>
                                        , {mus}
                                    </Text>)}
                                </Text>
                            </Text>
                            <Text className="font-pbold text-lg mt-2">
                                Equipment:
                                <Text className="font-pregular">
                                    {` ${selectedExercise?.equipment}`}
                                </Text>
                            </Text>

                            <View>
                                <Text className="font-pbold text-lg mt-3">Instructions</Text>
                                {
                                    selectedExercise?.instructions?.map((ins, index) => (
                                        <View className="flex flex-row mt-3" key={index}>
                                            <Text className="flex-[10%] font-pextrabold text-lg">{index + 1}</Text>
                                            <Text className="flex-[90%] font-pmedium">{ins}</Text>
                                        </View>
                                    ))
                                }
                            </View>

                        </BottomSheetScrollView>
                    </BottomSheetModal>

                </BottomSheetModalProvider> */}
                <BottomSheetModalComponent bottomSheetRef={bottomSheetRef} selectedExercise={selectedExercise} />
                <LoadingModal visible={isVisibleLoadingModal} message={'Your training is in process ...'} />
            </SafeAreaView>
        </>
    )
}

export default CreateExercisePage

const styles = StyleSheet.create({})