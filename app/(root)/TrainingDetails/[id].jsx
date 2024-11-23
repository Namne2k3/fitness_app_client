import { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomSheet from '../../../components/BottomSheet'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import CustomButton from '../../../components/CustomButton'
import ExerciseTrainingCard from '../../../components/ExerciseTrainingCard'
import { deleteTrainingById, fetchTrainingById } from '../../../libs/mongodb'
import { formatDate, getAbbreviation, randomColor } from '../../../utils/index'
import { images } from '../../../constants/image'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'

const TrainingDetails = () => {
    const { id } = useLocalSearchParams()
    const [isEdit, setIsEdit] = useState(false)
    const [trainingData, setTrainingData] = useState({})
    const [selectedExercise, setSelectedExercise] = useState({})
    const { colorScheme } = useColorScheme()
    const bottomSheetRef = useRef(null)
    const bottomEditSheetRef = useRef(null)
    const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false)
    let color = randomColor()

    const handleExeTrainingCardPress = useCallback(async (exercise) => {
        // const selectedData = await fetchExerciseById(exercise.id)
        setSelectedExercise(exercise)
        bottomSheetRef.current?.present()
    })

    const handleDeleteTrainingById = async (id) => {
        const response = await deleteTrainingById(id)
    }

    useEffect(() => {
        const getTrainingById = async () => {
            try {
                const data = await fetchTrainingById(id)
                setTrainingData(data)
            } catch (err) {
                console.log("Error: ", err.message);
            }
        }

        getTrainingById()
    }, [])

    return (
        <>
            <SafeAreaView className=" h-full relative dark:bg-slate-950">
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
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                bottomEditSheetRef.current?.present()
                                setIsEdit(true)
                            }}
                            className="relative"
                        >
                            <Entypo name='dots-three-vertical' size={18} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>
                </View >
                <View className="pl-4 pr-3 flex flex-row items-center justify-between">
                    <Text className="font-pextrabold text-[30px] dark:text-white uppercase flex-1">{trainingData?.title && `Bài tập ${trainingData.title}`}</Text>
                    <View style={styles.imageContainer} className='rounded-full'>

                        {
                            images[trainingData?.title?.toLowerCase()] ?
                                <Image
                                    source={images[trainingData?.title?.toLowerCase()]}
                                    style={styles.image}
                                    resizeMode='contain'
                                    className='rounded-full'
                                /> :
                                <View className={`rounded-full flex justify-center items-center p-5 ml-2`}
                                    style={{
                                        backgroundColor: color
                                    }}
                                >
                                    <Text className="text-white font-pextrabold text-[32px]">
                                        {getAbbreviation(trainingData?.title)}
                                    </Text>
                                </View>

                        }

                    </View>
                </View>

                <View className="mb-2 px-4">
                    <Text className="font-pextrabold text-[22px] dark:text-white">{trainingData?.exercises?.length && `${trainingData?.exercises?.length} bài tập`}</Text>
                </View>


                <FlatList
                    data={trainingData?.exercises}
                    renderItem={({ item }) => (
                        <ExerciseTrainingCard
                            onPress={handleExeTrainingCardPress}
                            item={item}
                        />
                    )}
                    contentContainerStyle={{
                        padding: 16,
                        // paddingBottom: 100,
                        backgroundColor: colorScheme == 'dark' ? "rgb(2, 6 ,23)" : '#f4f5f6"',
                    }}
                    ItemSeparatorComponent={() => (
                        <View className="h-[10px] bg-[#f4f5f6] dark:bg-slate-950" />
                    )}
                />


                {/* <View className="absolute bottom-0 p-4 flex w-full">
                    <CustomButton onPress={() => router.push(`/(root)/beginTraining/${id}`)} text={'Start'} />
                </View> */}
                {/* <BottomSheetModalComponent bottomSheetRef={bottomSheetRef} selectedExercise={selectedExercise} /> */}
                <View className="p-4 flex bg-transparent">
                    <CustomButton onPress={() => router.push(`/(root)/beginTraining/${id}`)} text={'Bắt đầu'} />
                </View>
            </SafeAreaView>
            <BottomSheetModalComponent bottomSheetRef={bottomSheetRef} selectedExercise={selectedExercise} />
            <BottomSheet snapPoints={["20%"]} bottomSheetRef={bottomEditSheetRef}>
                <View className="flex">
                    <TouchableOpacity onPress={() => router.push(`/(root)/editCustomTraining/${id}`)} className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]">
                        <Feather name='edit-3' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                        <Text className="font-pmedium text-[16px]">Tùy chỉnh</Text>
                    </TouchableOpacity>
                    {
                        trainingData?.isCustom == true &&
                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                "Delete Training",
                                "Are you sure you want to delete this training?",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Delete",
                                        onPress: async () => {
                                            await handleDeleteTrainingById(id)
                                            setIsVisibleModalEdit(false);
                                            router.replace('/(root)/(tabs)/custom')
                                        },
                                        style: "destructive",
                                    },
                                ]
                            );
                        }}
                            className="flex flex-row w-full justify-start items-start px-1 py-3 mx-2 border-b-[0.5px] border-[#ccc]"
                        >
                            <MaterialCommunityIcons name='delete-alert-outline' size={22} color={colorScheme == 'dark' ? '#fff' : "#000"} style={{ paddingRight: 8 }} />
                            <Text className="font-pmedium text-[16px]">Xóa</Text>
                        </TouchableOpacity>
                    }
                </View>
            </BottomSheet>
        </>
    )
}
const { width } = Dimensions.get('window');
export default TrainingDetails

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1
    },
    modalContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8
    },
    modalText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'left'
    },
    imageContainer: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: width * 0.3, // Chiều rộng là 40% màn hình
        height: width * 0.4, // Giữ tỷ lệ vuông
    },
})