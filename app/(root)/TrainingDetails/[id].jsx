import { Entypo, Feather } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import CustomButton from '../../../components/CustomButton'
import ExerciseTrainingCard from '../../../components/ExerciseTrainingCard'
import LoadingModal from '../../../components/LoadingModal'
import { images } from '../../../constants/image'
import { deleteTrainingById, fetchTrainingById } from '../../../libs/mongodb'
import { getAbbreviation, randomColor } from '../../../utils/index'

const TrainingDetails = () => {
    const { id } = useLocalSearchParams()
    const { index, planId, data } = useLocalSearchParams()

    const [trainingData, setTrainingData] = useState(data ? JSON.parse(data) : {})
    const [selectedExercise, setSelectedExercise] = useState({})
    const { colorScheme } = useColorScheme()
    const bottomSheetRef = useRef(null)
    const bottomEditSheetRef = useRef(null)
    const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    let color = randomColor()

    const handleExeTrainingCardPress = useCallback(async (exercise) => {
        setSelectedExercise(exercise)
        bottomSheetRef.current?.present()
    })

    const handleDeleteTrainingById = async (id) => {
        await deleteTrainingById(id)
    }

    useEffect(() => {
        const getTrainingById = async () => {
            setIsLoading(true)
            try {
                const found = await fetchTrainingById(id)

                if (found == null) {
                    throw new Error("Không tìm thấy dữ liệu")
                }
                setTrainingData(found)
            } catch (err) {
                Alert.alert("Không tìm thấy dữ liệu: ", "Dữ liệu có thể đã bị xóa", [
                    {
                        text: "Ok",
                        onPress: () => router.back()
                    }
                ]);
            } finally {
                setIsLoading(false)
            }
        }
        if (trainingData == null) {
            getTrainingById()
        }
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
                        {
                            trainingData?.isCustom &&
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsVisibleModalEdit(!isVisibleModalEdit);
                                    }}
                                    className="relative p-2"
                                >
                                    <Entypo name='dots-three-vertical' size={22} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                </TouchableOpacity>
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={isVisibleModalEdit}
                                    onRequestClose={() => {
                                        setIsVisibleModalEdit(!isVisibleModalEdit);
                                    }}
                                >
                                    <TouchableOpacity
                                        className="flex-1"
                                        onPress={() => setIsVisibleModalEdit(false)}
                                    />
                                    <View className="absolute top-[50px] right-[10px] border-[0.2px] bg-[#fff] dark:bg-slate-950 rounded-lg px-2 mr-1 mt-2">
                                        {
                                            trainingData?.isCustom &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Alert.alert(
                                                        "Xóa set tập",
                                                        "Bạn có chắc chắn muốn xóa set tập này?",
                                                        [
                                                            {
                                                                text: "Hủy",
                                                                style: "cancel",
                                                            },
                                                            {
                                                                text: "Xóa",
                                                                onPress: async () => {
                                                                    await handleDeleteTrainingById(id)
                                                                    setIsVisibleModalEdit(false);
                                                                    // router.replace('/(root)/(tabs)/custom')
                                                                    router.back()
                                                                },
                                                                style: "destructive",
                                                            },
                                                        ]
                                                    );
                                                }}
                                                className='py-3 px-4'
                                            >
                                                <Text className="text-left text-[#000] text-[14px] dark:text-white">Xóa</Text>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity
                                            className="py-3 px-4"
                                            onPress={() => router.push({
                                                pathname: `/(root)/editCustomTraining/${id}`,
                                                params: {
                                                    data: JSON.stringify(data)
                                                }
                                            })}
                                        >
                                            <Text className="text-left text-[#000] text-[14px] dark:text-white">Chỉnh sửa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </>
                        }
                    </View>
                </View >
                <View className="pl-4 pr-3 flex flex-row items-center justify-between">
                    <View className="flex">
                        <Text className="font-pextrabold text-[30px] dark:text-white uppercase flex-1">{trainingData?.title && `${trainingData.title}`}</Text>
                        <Text className="font-pextrabold text-[30px] dark:text-white uppercase flex-1">{trainingData?.name && `${trainingData.name}`}</Text>
                    </View>
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
                    renderItem={({ item }) => {
                        if (item.exercise)
                            return (
                                <ExerciseTrainingCard
                                    onPress={handleExeTrainingCardPress}
                                    item={item}
                                />
                            )
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 16,
                        backgroundColor: colorScheme == 'dark' ? "rgb(2, 6 ,23)" : '#f4f5f6"',
                    }}
                    ItemSeparatorComponent={() => (
                        <View className="h-[16px]  dark:bg-slate-950" />
                    )}
                />

                <View className="p-4 flex bg-transparent">
                    <CustomButton bgColor='bg-[#3749db]' onPress={() => router.push({
                        pathname: `/(root)/beginTraining/${id}`,
                        params: {
                            index: index, planId: planId, data: JSON.stringify(trainingData)
                        }
                    })} text={'Bắt đầu'} />
                </View>
            </SafeAreaView>
            <BottomSheetModalComponent bottomSheetRef={bottomSheetRef} selectedExercise={selectedExercise} />
            <LoadingModal visible={isLoading} />
        </>
    )
}
const { width } = Dimensions.get('window');
export default memo(TrainingDetails)

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