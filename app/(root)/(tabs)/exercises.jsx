
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'
import { fetchExerciseByQuery } from '../../../libs/exerciseDb'
import { images } from '../../../constants/image'
import { useColorScheme } from 'nativewind'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'



const Exercises = () => {

    const [isSearching, setIsSearching] = useState(false)
    const [offset, setOffSet] = useState(1)
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState({})
    const bottomSheetRef = useRef(null)
    const [searchQuery, onChangeSearchQuery] = useState('')
    const { colorScheme } = useColorScheme()
    const handlePresentModalSheet = useCallback((item) => {
        bottomSheetRef.current?.present()
        setSelectedExercise(item)
    })
    const handleToggleSearching = () => {
        setIsSearching(!isSearching)
        onChangeSearchQuery('')
    }

    const fetchDataByQuery = async (offsetProps = 0) => {
        try {
            const searchData = await fetchExerciseByQuery(searchQuery.toLowerCase(), offsetProps)
            if (searchData) {
                setExercises(searchData);
            }
        } catch (error) {
            console.error("Error fetching training data:", error);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchDataByQuery()
        return () => {
            setOffSet(0)
        }
    }, [searchQuery])

    return (
        <SafeAreaView className="px-4 pt-4 bg-[#fff] h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-[#f4f5f6] flex-1 mr-3"
                            color={'#000'}
                            value={searchQuery}
                            placeholder='Search for exercises...'
                            onChangeText={onChangeSearchQuery}
                        />
                        <View>
                            <TouchableOpacity onPress={handleToggleSearching}>
                                <MaterialIcons name='cancel' size={24} color={'#ccc'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pextrabold text-[32px] dark:text-white">Exercises</Text>
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
            {/* <BottomSheetModalProvider>

                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['65%', '90%']}
                    stackBehavior='replace'
                    enableDismissOnClose={true}
                    style={{
                        // borderWidth: 1,
                        // borderColor: '#00008B',
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
            <BottomSheetModalComponent selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
        </SafeAreaView>
    )
}

export default Exercises

const styles = StyleSheet.create({})