import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Pressable, ScrollView, Alert } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'
import { images } from '../../../constants/image'
import { useColorScheme } from 'nativewind'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import BottomSheet from '../../../components/BottomSheet'
import { getAllExercisesBySearchQueryName } from '@/libs/mongodb'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CustomButton from '@/components/CustomButton'

const bodyParts = [
    'bụng', 'cardio',
    'chân', 'cơ cổ',
    'lưng', 'mông',
    'ngực', 'tay',
    'vai'
]

const equipments = [
    'bóng bosu',
    'bóng tặp thăng bằng',
    'máy tập trượt tuyết (skierg)',
    'bóng y tế',
    'búa',
    'con lăn',
    'con lăn bánh xe',
    'dây kháng lực',
    'dây thừng',
    'lốp xe',
    'máy cáp',
    'máy kéo tạ',
    'máy leo cầu thang',
    'máy tập elip',
    'máy tập smith',
    'máy tập thân trên',
    'máy tập đòn bẩy',
    'thanh trap',
    'thanh tạ',
    'thanh tạ ez',
    'trọng lượng cơ thể',
    'tạ olympic',
    'tạ tay',
    'tạ đeo',
    'tạ ấm',
    'xe đạp tập cố định'
]


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
            console.log("Error fetching training data:", error);
        } finally {
            setSmallLoading(false)
            setIsLoading(false);
        }
    };

    const handleSaveFilter = async () => {
        try {
            bottomSheetRefFilter?.current?.dismiss()
            await fetchDataByQuery(true)
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

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
        const debounceTimeout = setTimeout(() => {
            fetchDataByQuery(true);
        }, 1000);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, filter.bodyParts, filter.equipments]);

    return (
        <SafeAreaView className="px-4 pt-4 h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-[#fff] flex-1 mr-3"
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
            <View className="flex flex-row justify-between items-center my-2">
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
                    <Text>Hủy lọc</Text>
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
                                    resizeMethod="contain"
                                />
                                <Text className="text-sm">No exercises found!</Text>
                            </View>
                        )}

                    />
                )
            }
            <BottomSheetModalComponent selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
            <BottomSheet title="Lọc bài tập" enablePanDownToClose={false} snapPoints={['95%']} bottomSheetRef={bottomSheetRefFilter}>
                <View className="p-2 rounded-lg bg-neutral-100 border-[0.5px] m-2">
                    <Text className="font-pmedium text-lg mb-1">Phần bộ phận cơ thể</Text>
                    <View className="flex flex-row flex-wrap">
                        {
                            bodyParts.map((item, index) => (
                                <Pressable
                                    onPress={() => handleSelectBodyPart(item)}
                                    key={index}
                                    className={`p-2 rounded-full border-[0.5px] mr-1 mb-1 ${filter?.bodyParts?.includes(item) && 'bg-[#000]'}`}
                                >
                                    <Text className={`font-pbold text-[12px] uppercase ${filter?.bodyParts?.includes(item) && 'text-white'}`}>{item}</Text>
                                </Pressable>
                            ))
                        }
                    </View>
                </View>

                <View className="p-2 rounded-lg bg-neutral-100 border-[0.5px] mx-2">
                    <Text className="font-pmedium text-lg mb-1">Thiết bị</Text>
                    <View className="flex flex-row flex-wrap">

                        {
                            equipments.map((item, index) => (
                                <Pressable
                                    onPress={() => handleSelectEquipment(item)}
                                    key={index}
                                    className={`p-2 rounded-full border-[0.5px] mr-1 mb-1 ${filter?.equipments?.includes(item) && 'bg-[#000]'}`}
                                >
                                    <Text className={`font-pbold text-[12px] uppercase ${filter?.equipments?.includes(item) && 'text-white'}`}>{item}</Text>
                                </Pressable>
                            ))
                        }

                    </View>
                </View>
                <View className="m-2">
                    <CustomButton onPress={handleSaveFilter} bgColor='bg-[#3749db]' text={'Lưu'} />
                </View>
            </BottomSheet>
        </SafeAreaView>
    )
}

export default Exercises

const styles = StyleSheet.create({})