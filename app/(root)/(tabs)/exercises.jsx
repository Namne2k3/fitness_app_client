
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'
import { images } from '../../../constants/image'
import { useColorScheme } from 'nativewind'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import { getAllExercisesBySearchQueryName } from '@/libs/mongodb'




const Exercises = () => {

    const [smallLoading, setSmallLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState({})
    const bottomSheetRef = useRef(null)
    const [searchQuery, onChangeSearchQuery] = useState('')
    const { colorScheme } = useColorScheme()
    const [skip, setSkip] = useState(0)
    const limit = 10
    const refTextInput = useRef(null)

    const handlePresentModalSheet = useCallback((item) => {
        bottomSheetRef.current?.present()
        setSelectedExercise(item)
    })
    const handleToggleSearching = () => {
        setIsSearching(!isSearching)
        onChangeSearchQuery('')
    }

    const fetchDataByQuery = async (isSearchReset = false) => {
        setSmallLoading(true)
        try {
            if (isSearchReset) {
                setIsLoading(true);
                setSkip(0);
                setExercises([]);
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
        fetchDataByQuery(true)
    }, [searchQuery])

    return (
        <SafeAreaView className="px-4 pt-4 bg-[#fff] h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center mb-4">
                        <TextInput
                            className="p-3 rounded-lg bg-[#f4f5f6] flex-1 mr-3"
                            color={'#000'}
                            value={searchQuery}
                            placeholder='Tìm kiếm tên bài tập...'
                            onChangeText={onChangeSearchQuery}
                            autoFocus={true}
                        />
                        <View>
                            <TouchableOpacity onPress={handleToggleSearching}>
                                <MaterialIcons name='cancel' size={24} color={'#ccc'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                    <View className="flex flex-row justify-between items-center mb-4">
                        <Text className="font-pextrabold text-[32px] dark:text-white">Các bài tập</Text>
                        <View>
                            <TouchableOpacity onPress={handleToggleSearching}>
                                <FontAwesome name='search' size={26} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            {
                isLoading ? (
                    <View className="h-full flex justify-center items-center">
                        <ActivityIndicator color={"#000"} size={'large'} />
                    </View>
                ) : (
                    <FlatList
                        data={exercises}
                        renderItem={({ item: exercise }) => (
                            <ExerciseDetailCard
                                exercise={exercise}
                                handlePresentModalSheet={handlePresentModalSheet}
                            />
                        )}
                        ItemSeparatorComponent={() =>
                            <View className="h-[16px] bg-[#fff] dark:bg-slate-950" />
                        }
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponentStyle={{
                            marginBottom: 16,
                        }}
                        ListFooterComponent={
                            !smallLoading ?
                                <TouchableOpacity className='p-4 flex flex-row justify-center items-center' onPress={() => fetchDataByQuery(false)}>
                                    <Ionicons name='reload' size={30} />
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
                        contentContainerStyle={{
                            paddingBottom: 16
                        }}

                    />
                )
            }
            <BottomSheetModalComponent selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
        </SafeAreaView>
    )
}

export default Exercises

const styles = StyleSheet.create({})