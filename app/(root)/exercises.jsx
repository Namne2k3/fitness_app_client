import { getAllBodyPart, getAllEquipments, getAllExercisesBySearchQueryName } from '@/libs/mongodb'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import BottomSheet from '../../components/BottomSheet'
import BottomSheetModalComponent from '../../components/BottomSheetModal'
import ExerciseDetailCard from '../../components/ExerciseDetailCard'
import { images } from '../../constants/image'

const Exercises = () => {

    const [smallLoading, setSmallLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState({})
    const bottomSheetRef = useRef(null)
    const bottomSheetRefFilter = useRef(null)
    const [searchQuery, onChangeSearchQuery] = useState('')
    const { colorScheme } = useColorScheme()
    const [skip, setSkip] = useState(0)
    const limit = 10
    const [bodyParts, setBodyParts] = useState([])
    const [equipments, setEquipments] = useState([])

    const [filter, setFilter] = useState({
        bodyParts: [],
        equipments: [],
    })

    const handlePresentModalSheet = useCallback((item) => {
        bottomSheetRef.current?.present()
        setSelectedExercise(item)
    })
    const handleToggleSearching = () => {
        setIsSearching(!isSearching)
        onChangeSearchQuery('')
    }

    const handlePresentFilterModal = () => {
        bottomSheetRefFilter?.current?.present()
    }

    const fetchDataByQuery = async (isSearchReset = false) => {
        setSmallLoading(true)
        try {
            if (isSearchReset) {
                setIsLoading(true);
                setSkip(0);
                setExercises([]);
            }

            const res = await getAllExercisesBySearchQueryName(searchQuery || "", {
                limit,
                skip: isSearchReset ? 0 : skip,
                bodyParts: filter?.bodyParts ?? null,
                equipments: filter?.equipments ?? null
            });

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
            console.log("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setSmallLoading(false)
            setIsLoading(false);
        }
    };

    const handleSelectBodyPart = (item) => {
        if (!filter?.bodyParts?.includes(item)) {
            setFilter((filter) => ({
                ...filter,
                bodyParts: [
                    ...filter.bodyParts,
                    item
                ]
            }))
        } else {
            setFilter((filter) => ({
                ...filter,
                bodyParts: filter.bodyParts.filter(i => i != item)
            }))
        }
    }

    const handleSelectEquipment = (item) => {
        if (!filter?.equipments?.includes(item)) {
            setFilter((filter) => ({
                ...filter,
                equipments: [
                    ...filter.equipments,
                    item
                ]
            }))
        } else {
            setFilter((filter) => ({
                ...filter,
                equipments: filter.equipments.filter(i => i != item)
            }))
        }
    }

    useEffect(() => {
        const fetchAllBodyParts = async () => {
            try {
                const res = await getAllBodyPart()
                setBodyParts(res.data)
            } catch (error) {
                console.log("Lỗi tìm tất cả dữ liệu bộ phận cơ thể", error.message)
            }
        }
        fetchAllBodyParts()
    }, [])

    useEffect(() => {
        const fetchAllEquipments = async () => {
            try {
                const res = await getAllEquipments()
                setEquipments(res.data)
            } catch (error) {
                console.log("Lỗi tìm tất cả dữ liệu thiết bị", error.message)
            }
        }

        fetchAllEquipments()
    }, [])

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchDataByQuery(true);
        }, 1000);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, filter.bodyParts, filter.equipments]);

    return (
        <View className="px-4 pt-2 h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-neutral-200 flex-1 mr-3"
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
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pextrabold text-[32px] dark:text-white uppercase">tìm kiếm</Text>
                        <View>
                            <TouchableOpacity onPress={handleToggleSearching}>
                                <FontAwesome name='search' size={26} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            <View className="flex flex-row justify-between items-center my-3">
                <View>
                    <TouchableOpacity onPress={() => handlePresentFilterModal()} className="rounded-lg flex flex-row items-center justify-center bg-neutral-200 p-2">
                        <Ionicons name='filter-sharp' size={20} />
                        <Text className="font-pmedium ml-1">Lọc</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    disabled={filter.bodyParts.length > 0 || filter.equipments.length > 0 ? false : true}
                    onPress={() => setFilter({
                        bodyParts: [],
                        equipments: [],
                    })}>
                    <Text className="dark:text-gray-400">Hủy lọc</Text>
                </TouchableOpacity>
            </View>
            {
                isLoading ? (
                    <View className="h-full flex justify-center items-center">
                        <ActivityIndicator color={colorScheme == 'dark' ? '#fff' : '#000'} size={'large'} />
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
                            <View className="h-[16px] bg-[#f3f2f3] dark:bg-slate-950" />
                        }
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponentStyle={{
                            marginBottom: 16,
                        }}
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
                                    contentFit="contain"
                                />
                                <Text className="text-sm">Không tìm thấy dữ liệu bài tập!</Text>
                            </View>
                        )}

                    />
                )
            }
            <BottomSheetModalComponent snapPoints={['100%']} selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
            <BottomSheet
                title="Lọc bài tập"
                enablePanDownToClose={true}
                snapPoints={['90%']}
                bottomSheetRef={bottomSheetRefFilter}
            >
                <View className="p-2 rounded-lg bg-neutral-100 border-[0.5px] m-2 dark:bg-[#292727] dark:border-[#ccc]">
                    <Text className="font-pmedium text-lg mb-1 dark:text-white">Phần bộ phận cơ thể</Text>
                    <View className="flex flex-row flex-wrap">
                        {bodyParts.map((item, index) => (
                            <Pressable
                                onPress={() => handleSelectBodyPart(item)}
                                key={index}
                                className={`p-2 rounded-full border-[0.5px] mr-1 mb-1 dark:bg-[#292727] ${filter?.bodyParts?.includes(item) && 'bg-[#000] dark:bg-white'}`}
                            >
                                <Text
                                    className={`font-pbold text-[12px] uppercase dark:text-white ${filter?.bodyParts?.includes(item) && 'text-white dark:text-black'} `}
                                >
                                    {item._id}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View className="p-2 rounded-lg bg-neutral-100 border-[0.5px] mx-2 dark:bg-[#292727] dark:border-[#ccc]">
                    <Text className="font-pmedium text-lg mb-1 dark:text-white">Thiết bị</Text>
                    <View className="flex flex-row flex-wrap">
                        {equipments.map((item, index) => (
                            <Pressable
                                onPress={() => handleSelectEquipment(item)}
                                key={index}
                                className={`p-2 rounded-full border-[0.5px] mr-1 mb-1 dark:bg-[#292727] ${filter?.equipments?.includes(item) && 'bg-black dark:bg-white'}`}
                            >
                                <Text
                                    className={`font-pbold text-[12px] uppercase dark:text-white ${filter?.equipments?.includes(item) && 'text-white dark:text-black'}`}
                                >
                                    {item._id}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </BottomSheet>

        </View>
    )
}

export default Exercises

const styles = StyleSheet.create({})