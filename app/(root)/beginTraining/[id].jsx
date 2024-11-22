import { AntDesign, Feather } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/CustomButton'
import LoadingModal from '../../../components/LoadingModal'
import TrainingCard from '../../../components/TrainingCard'
import { createTrainingRecord, fetchTrainingById } from '../../../libs/mongodb'
import { useUserStore } from '../../../store'

async function generatePrompt(trainingRecord) {
    try {


        const training = JSON.parse(trainingRecord.training);
        const exercises = training.exercises;
        const totalTime = trainingRecord.duration;

        let prompt = `Giúp tôi tính calo tiêu hao cho buổi tập:\n`;

        exercises.forEach((exerciseData, index) => {
            const exercise = exerciseData.exercise;
            const sets = exerciseData.sets;

            // Tạo thông tin bài tập
            let exerciseInfo = `- ${exercise.name}: `;
            let setsInfo = sets
                .map((set, setIndex) => {
                    return `${set.reps} reps x ${set.kilogram} kg${setIndex === sets.length - 1 ? '' : ', '}`;
                })
                .join("");
            exerciseInfo += `${sets.length} sets (${setsInfo}).`;

            prompt += exerciseInfo + `\n`;
        });

        prompt += `- Tổng thời gian: ${totalTime}, chia đều cho ${exercises.length} bài tập.\n`;

        return prompt;
    } catch (error) {
        console.log("error prompt >>> ", error.message);

    }
}

const BeginTrainingId = () => {

    const [dataTraining, setDataTraining] = useState({})
    const { id } = useLocalSearchParams()
    const [time, setTime] = useState('00:00');
    const [isCompleted, setIsCompleted] = useState(false)
    const user = useUserStore((state) => state.user)
    const [isRunning, setIsRunning] = useState(true)
    const [elapsedTime, setElapsedTime] = useState(0)
    const { colorScheme } = useColorScheme()
    const [backModalVisible, setBackModalVisible] = useState(false)
    const [isVisibleLoadingModal, setIsVisibleLoadingModal] = useState(false)

    const pad = (number) => {
        return number < 10 ? `0${number}` : number;
    };

    const checkAllExercisesCompleted = () => {
        return dataTraining?.exercises?.every(exercise => {
            return exercise.sets.every(set => set.isCheck);
        })
    }

    const calculateCaloriesBurned = (time, trainingData, bodyWeightKg) => {
        if (trainingData) {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            const totalDurationInMinutes = (hours * 60) + minutes + (seconds / 60);
            const totalExercises = trainingData?.exercises?.length;
            const timePerExerciseInMinutes = totalDurationInMinutes / totalExercises;

            let totalCaloriesBurned = 0;

            trainingData?.exercises.forEach(exercise => {
                const sets = exercise.sets;
                const timePerSetInMinutes = timePerExerciseInMinutes / sets.length;
                let exerciseCaloriesBurned = 0;
                sets.forEach(set => {
                    let MET;

                    if (set.reps < 5) {
                        MET = 6 + (set.kilogram * 0.05);
                    } else if (set.reps >= 6 && set.reps <= 12) {
                        MET = 4 + (set.kilogram * 0.03);
                    } else {
                        MET = 3 + (set.kilogram * 0.02);
                    }


                    const caloriesBurnedPerSet = MET * bodyWeightKg * (timePerSetInMinutes / 60) * 1.05;
                    exerciseCaloriesBurned += caloriesBurnedPerSet;
                });

                totalCaloriesBurned += exerciseCaloriesBurned;
            });

            return totalCaloriesBurned;
        }
    }

    const handleAddSet = useCallback((item) => {
        setDataTraining(prevTrainings => {
            const updatedTrainings = prevTrainings.exercises.map(exercise => {
                if (exercise === item) {

                    const updatedSets = [...exercise.sets, { kilogram: 0, reps: 1 }];
                    return {
                        ...exercise,
                        sets: updatedSets
                    };
                }
                return exercise;
            });

            return {
                ...prevTrainings,
                exercises: updatedTrainings
            };
        });

    }, [setDataTraining]);


    const handleRemoveLastSet = useCallback((item) => {
        setDataTraining(prevTrainings => {

            const updatedTrainings = prevTrainings.exercises.map(exercise => {
                if (exercise === item) {

                    if (exercise.sets.length > 1) {

                        const updatedSets = exercise.sets.slice(0, -1);
                        return {
                            ...exercise,
                            sets: updatedSets
                        };
                    }
                }
                return exercise;
            });

            return {
                ...prevTrainings,
                exercises: updatedTrainings
            };
        });
        setIsCompleted((previous) => checkAllExercisesCompleted())
    }, [setDataTraining]);


    const handleUpdateKilogramAndReps = useCallback(async (item, index, newKilo, newReps) => {

        setDataTraining(prevData => {

            const updatedExercises = prevData.exercises.map(exercise => {

                if (exercise.exercise.id === item.exercise.id) {

                    const updatedSets = exercise.sets.map((set, setIndex) => {
                        if (setIndex === index) {
                            return { kilogram: newKilo, reps: newReps === 0 ? 1 : newReps };
                        }
                        return set;
                    });
                    return { ...exercise, sets: updatedSets };
                }
                return exercise;
            });


            return { ...prevData, exercises: updatedExercises };
        });
        setIsCompleted((previous) => checkAllExercisesCompleted())

    }, [setDataTraining]);

    const handleUpdateIsCheck = useCallback(async (item, index, isCheck) => {

        setDataTraining(prevData => {

            const updatedExercises = prevData.exercises.map(exercise => {

                if (exercise.exercise.id === item.exercise.id) {

                    const updatedSets = exercise.sets.map((set, setIndex) => {
                        if (setIndex === index) {
                            return {
                                ...set,
                                isCheck: isCheck
                            };
                        }
                        return set;
                    });
                    return { ...exercise, sets: updatedSets };
                }
                return exercise;
            });


            return { ...prevData, exercises: updatedExercises };
        });
        setIsCompleted((previous) => checkAllExercisesCompleted())
    }, [setDataTraining]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleFinishedTraining = async () => {
        setIsVisibleLoadingModal(true)
        try {
            const trainingRecord = {
                duration: time,
                training: dataTraining,
                user: user?._id,
                caloriesBurned: calculateCaloriesBurned("01:00:00", dataTraining, user?.weight)
            }

            const saved = await createTrainingRecord(trainingRecord)
            let promptCreate = await generatePrompt({
                duration: "01:00:00",
                training: JSON.stringify(dataTraining),
                user: user,
                caloriesBurned: calculateCaloriesBurned("01:00:00", dataTraining, user?.weight)
            })

            if (saved) {
                setIsVisibleLoadingModal(false)
                router.replace(`/(root)/finishTraining/${saved?._id}`)
            }
        } catch (error) {
            setIsVisibleLoadingModal(false)
            console.log(error.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTrainingById(id)
            setDataTraining(data)
        }

        fetchData()
    }, [])

    useEffect(() => {
        let intervalId;
        let startTime;

        if (isRunning) {
            startTime = Date.now() - elapsedTime;

            const updateTimer = () => {
                const currentTime = Date.now();
                const newElapsedTime = currentTime - startTime;

                const seconds = Math.floor((newElapsedTime / 1000) % 60);
                const minutes = Math.floor((newElapsedTime / (1000 * 60)) % 60);
                const hours = Math.floor((newElapsedTime / (1000 * 60 * 60)) % 24);

                setTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
                setElapsedTime(newElapsedTime);
            };

            intervalId = setInterval(updateTimer, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    useEffect(() => {
        setIsCompleted((previous) => checkAllExercisesCompleted());
    }, [dataTraining]);

    return (
        <SafeAreaView className="h-full bg-[#fff] relative pb-[90px] dark:bg-slate-950">
            <View className={`flex flex-row border-b-[1px] border-[${colorScheme == 'dark' ? '000' : '#eaecef'}] w-full`}>
                <View className="p-4 flex justify-center items-center">
                    <TouchableOpacity
                        onPress={() => setBackModalVisible(true)}
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                </View>
                <View className="flex flex-row p-2 justify-between items-center flex-1">
                    <View>
                        <Text className="font-pmedium text-sm dark:text-white">{dataTraining?.title}</Text>
                        <Text className="font-pextrabold text-[24px] dark:text-white">{time}</Text>
                    </View>

                    {
                        !isRunning &&
                        <View className="mr-2">
                            <TouchableOpacity
                                className="bg-[#00008B] rounded-lg  p-4"
                                onPress={() => handleStart()}
                            >
                                <Text className="font-psemibold text-lg text-white">Tiếp tục</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
            <View className="p-4">
                <Text className="font-psemibold text-yellow-500">Note: </Text>
                <Text className="font-pregular dark:text-white">
                    {/* We'll calculate calories based on how many reps you've done, so make sure you get them right for accurate results. */}
                    Chúng tôi tính toán lượng calo tiêu hao dựa vào thông tin luyện tập của bạn, và chỉ mang tính chất tham khảo
                </Text>
            </View>

            <FlatList
                data={dataTraining?.exercises}
                renderItem={({ item }) => (
                    <View className="bg-[#fff] flex p-4 dark:bg-slate-800">
                        <TrainingCard handleUpdateIsCheck={handleUpdateIsCheck} hasCheck={true} handleUpdateKilogramAndReps={handleUpdateKilogramAndReps} item={item} />
                        <View className="flex flex-row justify-between items-center">
                            <CustomButton
                                containerStyle="mt-4 flex-1 mr-2 border-[1px] border-[#000]"
                                textStyle={{ color: colorScheme == 'dark' ? '#fff' : '#000' }}
                                bgColor={colorScheme == 'dark' ? 'bg-slate-800' : 'bg-[#fff]'}
                                text="-"
                                onPress={() => handleRemoveLastSet(item)}
                            />
                            <CustomButton
                                containerStyle="mt-4 flex-1 ml-2 border-[1px] border-[#000]"
                                textStyle={{ color: colorScheme == 'dark' ? '#fff' : '#000' }}
                                bgColor={colorScheme == 'dark' ? 'bg-slate-800' : 'bg-[#fff]'}
                                text="+"
                                onPress={() => handleAddSet(item)}
                            />
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View className="bg-[#eaecef] h-[10px] dark:bg-slate-950" />
                )}
                showsVerticalScrollIndicator={false}
            />


            <View className="absolute bottom-0 left-0 right-0 m-4">
                <CustomButton
                    disabled={!isCompleted}
                    text="Hoàn thành"
                    onPress={handleFinishedTraining}
                    bgColor={`${isCompleted ? "bg-[#00008B]" : "bg-[#ccc]"}`}
                />
            </View>

            <Modal
                visible={backModalVisible}
                onRequestClose={() => {
                    setBackModalVisible(!backModalVisible);
                }}
                animationType="slide"
                transparent={true}
            >
                <View className="h-full flex " style={{ backgroundColor: 'rgba(0, 0, 139, 0.7)' }}>
                    <TouchableOpacity
                        className="w-full top-0 p-4 mb-[150px]"
                        onPress={() => setBackModalVisible(false)}

                    >
                        <AntDesign name='close' size={28} color={'#fff'} />
                    </TouchableOpacity>
                    <View className="flex w-[80%] h-[70%] mx-auto">

                        <TouchableOpacity
                            className="px-4 py-3 rounded-lg mb-3"
                            style={{ backgroundColor: 'rgba(0, 0, 100, 0.7)' }}
                            onPress={() => {
                                handlePause()
                                setBackModalVisible(false)
                            }}
                        >
                            <Text className="uppercase text-white text-[28px] font-pextrabold">Tạm dừng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="px-4 py-3 rounded-lg mb-3"
                            style={{ backgroundColor: 'rgba(0, 0, 100, 0.7)' }}
                            onPress={() => setBackModalVisible(false)}
                        >
                            <Text className="uppercase text-white text-[28px] font-pextrabold">Trở lại</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            className="px-4 py-3 rounded-lg mb-3"
                            style={{ backgroundColor: 'rgba(0, 0, 100, 0.7)' }}
                            onPress={() => router.replace(`/(root)/beginTraining/${id}`)}
                        >
                            <Text className="uppercase text-white text-[28px] font-pextrabold">Bắt đầu lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="px-4 py-3 rounded-lg mb-3"
                            style={{ backgroundColor: 'rgba(0, 0, 100, 0.7)' }}
                            onPress={() => router.back()}
                        >
                            <Text className="uppercase text-white text-[28px] font-pextrabold">Kết thúc</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
            <LoadingModal visible={isVisibleLoadingModal} message={'Loading'} />
        </SafeAreaView>
    )
}

export default BeginTrainingId

const styles = StyleSheet.create({})