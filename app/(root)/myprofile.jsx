import { AntDesign, Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Image } from 'expo-image'
import { launchImageLibraryAsync } from 'expo-image-picker'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomSheet from '../../components/BottomSheet'
import CustomButton from '../../components/CustomButton'
import InputField from '../../components/InputField'
import LoadingModal from '../../components/LoadingModal'
import { images } from '../../constants/image'
import { levelToPointMap, seedDataOrm } from '../../constants/seeds'
import { uploadFile } from '../../libs/appwrite'
import { getAllExercises, handleUpdateUser, reCreatePlans, reCreateTrainingsByUserId, updateUserById } from '../../libs/mongodb'
import useUserStore from '../../store/userStore'
import { calculate1RM, createPlansForUser, generateTrainings } from '../../utils'
import { analyzeUser, BMR, calculateTrainingPlan } from '../../utils/index'

const { width } = Dimensions.get('window');

function urlSelected(name) {
    let selected = {}
    seedDataOrm.forEach((item) => {
        if (item.name == name)
            selected = item
    })

    return selected.url;
}

const removeImageField = (obj) => {
    const { image, ...rest } = obj;
    return rest;
};

const MyProfile = () => {

    const { user, setUser } = useUserStore()

    const [tempUser, setTempUser] = useState({})
    const { colorScheme } = useColorScheme()
    const [isChanging, setIsChanging] = useState("")
    const [profileImage, setProfileImage] = useState({})
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const bottomSheetRef = useRef(null);
    const [selected, setSelected] = useState(seedDataOrm[0].name)
    const [isLbs, setIsLbs] = useState(false)
    const [weight, setWeight] = useState(Number(0))
    const [reps, setReps] = useState(Number(1))
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const isModified = () => {
        return JSON.stringify(removeImageField(user)) !== JSON.stringify(removeImageField(tempUser));
    };

    const openPicker = async () => {
        let result = await launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setProfileImage(result.assets[0])
        }
    }

    const handleUpdateUserImage = async () => {
        setIsVisibleModal(true)
        try {
            // upload file image
            const imageUrl = await uploadFile(profileImage, profileImage?.type)
            const updatedUser = await handleUpdateUser({ ...user, image: imageUrl.uri })
            setUser(updatedUser)
            setProfileImage({})

        } catch (error) {
            console.log("Error: ", error.message);
            Alert.alert("Error", error.message)
        } finally {
            setIsVisibleModal(false)
        }
    }

    const handleDismissBottomSheet = async () => {
        try {
            bottomSheetRef?.current?.dismiss()
        } catch (error) {
            Alert.alert('Lỗi', error.message)
        }
    }

    const handlePresentBottomSheet = () => {
        try {
            bottomSheetRef?.current?.present()
        } catch (error) {
            Alert.alert('Lỗi', error.message)
        }
    }

    const handleOnlyUpdateInfo = async () => {
        setIsVisibleModal(true)
        try {

            const { daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            } = calculateTrainingPlan(tempUser)


            const { currentBMI, targetBMI } = analyzeUser(
                tempUser.weight, tempUser.height, tempUser.targetWeight
            )

            setTempUser((temp) => ({
                ...temp,
                daysShouldTraining: daysShouldTraining,
                caloriesPerTraining: caloriesPerTraining,
                totalDaysToReachTarget: totalDaysToReachTarget,
                fatRequirement: fatRequirement,
                proteinRequirement: proteinRequirement,
                mealDistribution: mealDistribution,
                bmi: currentBMI,
                targetBMI: targetBMI
            }))

            const res = await updateUserById({
                ...tempUser,
                daysShouldTraining: daysShouldTraining,
                caloriesPerTraining: caloriesPerTraining,
                totalDaysToReachTarget: totalDaysToReachTarget,
                fatRequirement: fatRequirement,
                proteinRequirement: proteinRequirement,
                mealDistribution: mealDistribution,
                bmi: currentBMI,
                targetBMI: targetBMI
            })

            if (res.data != null) {
                setUser(res.data)
                setTempUser(res.data)
                Alert.alert(res.message)
            } else {
                throw new Error('Không thể cập nhật thông tin')
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setIsVisibleModal(false)
        }
    }

    const handleUpdateUserInfoAndRecreatePlans = async () => {
        setIsVisibleModal(true)
        try {
            const { data } = await getAllExercises();

            const { daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            } = calculateTrainingPlan(tempUser)

            const { currentBMI, targetBMI } = analyzeUser(
                tempUser.weight, tempUser.height, tempUser.targetWeight
            )
            setTempUser((temp) => ({
                ...temp,
                daysShouldTraining: daysShouldTraining,
                caloriesPerTraining: caloriesPerTraining,
                totalDaysToReachTarget: totalDaysToReachTarget,
                fatRequirement: fatRequirement,
                proteinRequirement: proteinRequirement,
                mealDistribution: mealDistribution,
                bmi: currentBMI,
                targetBMI: targetBMI
            }))


            const updatedUser = await updateUserById({
                ...tempUser,
                daysShouldTraining: daysShouldTraining,
                caloriesPerTraining: caloriesPerTraining,
                totalDaysToReachTarget: totalDaysToReachTarget,
                fatRequirement: fatRequirement,
                proteinRequirement: proteinRequirement,
                mealDistribution: mealDistribution,
                bmi: currentBMI,
                targetBMI: targetBMI
            })

            setUser(updatedUser.data)

            const createdTrainings = await generateTrainings(updatedUser.data, data)
            const savedTrainings = await reCreateTrainingsByUserId(createdTrainings)
            const plans = await createPlansForUser(tempUser, savedTrainings.data);
            const savedPlan = await reCreatePlans(plans);
            if (savedPlan?.data?.length > 0) {
                router.replace('/(root)/(tabs)/me')
            }

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setIsVisibleModal(false)
        }
    }

    const handleUpdateUserInfo = async () => {
        try {
            Alert.alert(
                "",
                "Bạn có thiết lập lại kế hoạch tập luyện sau khi cập nhật thông tin cá nhân?",
                [
                    {
                        text: "Trở lại",
                        style: "cancel",
                    },
                    {
                        text: "Chỉ cập nhật thông tin",
                        onPress: handleOnlyUpdateInfo,
                        style: "destructive",
                    },
                    {
                        text: "Cập nhật và thiết lập lại",
                        onPress: () => handleUpdateUserInfoAndRecreatePlans(),
                        style: "destructive",
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        }
    }

    const calculateAge = () => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDifference = today.getMonth() - date.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
            age--;
        }
        return age;
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setTempUser((temp) => ({
            ...temp,
            age: calculateAge()
        }))
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    useEffect(() => {
        setTempUser(user);
    }, [])

    return (
        <SafeAreaView className="h-full p-4 dark:bg-slate-950">
            <View className="flex flex-row justify-start items-center">
                <TouchableOpacity
                    onPress={() => {
                        if (isModified()) {
                            Alert.alert(
                                "Thông tin chỉnh sửa chưa được lưu",
                                "Bạn có chắc chắn muốn hủy chỉnh sửa?",
                                [
                                    {
                                        text: "Trở lại",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Hủy chỉnh sửa",
                                        onPress: () => {
                                            setTempUser(user)
                                            router.back()
                                        }
                                    },
                                ]
                            );
                        } else {
                            router.back()
                        }
                    }}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                >
                    <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="ml-4 font-pextrabold text-[28px] dark:text-white">Thông tin của tôi</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative flex justify-center items-center mt-4">
                    <Image
                        source={{ uri: profileImage?.uri ? profileImage?.uri : user?.image ?? "https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg" }}
                        width={120}
                        height={120}
                        className="rounded-full"
                        contentFit='cover'
                    />
                    <TouchableOpacity onPress={openPicker} className="absolute">
                        <Feather name='camera' size={24} color={"#000"} />
                    </TouchableOpacity>

                </View>
                {
                    profileImage?.uri &&
                    <View className="flex flex-row mt-2 justify-center items-center">
                        <TouchableOpacity
                            className={
                                colorScheme == 'dark'
                                    ? `flex-1 bg-[#000] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                                    : `flex-1 bg-[#ccc] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                            }
                            onPress={handleUpdateUserImage}
                        >
                            <Text className="font-pregular text-[12px] dark:text-white">Cập nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={
                                colorScheme == 'dark'
                                    ? `flex-1 bg-[#000] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                                    : `flex-1 bg-[#ccc] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                            }
                            onPress={() => setProfileImage({})}
                        >
                            <Text className="font-pregular text-[12px] dark:text-white">Hủy</Text>
                        </TouchableOpacity>
                    </View>
                }

                <View className="mt-4">
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("orm")
                            handlePresentBottomSheet()
                        }}
                        className="bg-[#fff] dark:bg-[#292727] flex p-4 rounded-lg shadow-xl"
                    >
                        <Text className="dark:text-white font-pmedium">One Rep Max</Text>
                        <View className='flex flex-row justify-between items-center'>
                            <Text className="font-psemibold text-lg capitalize dark:text-white">
                                {`${isModified() ? tempUser?.orm : user?.orm} kg`}
                            </Text>
                            <AntDesign size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="mt-4">
                    <Text className="text-[#acaaaa] font-pregular">Thông tin cơ bản</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("gender")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Giới tính</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white capitalize">
                                {
                                    isModified()
                                        ?
                                        tempUser?.gender == 'female' ? 'nữ' : 'nam'
                                        :
                                        user?.gender == 'female' ? 'nữ' : 'nam'
                                }
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("weight")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Tuổi</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white capitalize">
                                {
                                    isModified()
                                        ?
                                        tempUser?.age
                                        :
                                        user?.age
                                }
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("weight")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Cân nặng hiện tại</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.weight
                                        : user?.weight
                                } Kg
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("weight")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Mục tiêu cân nặng</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.targetWeight
                                        : user?.targetWeight
                                } Kg
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("weight")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Chiều cao</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.height
                                        : user?.height
                                } Cm
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("healthGoal")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Mục tiêu</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.healthGoal
                                        : user?.healthGoal
                                }
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("activityLevel")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Tầng suất hoạt động</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.activityLevel
                                        : user?.activityLevel
                                }
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsChanging("level")
                            handlePresentBottomSheet()
                        }}
                        className='shadow-xl mt-2 flex flex-row justify-between items-center p-4 bg-[#fff] dark:bg-[#292727] rounded-lg'>
                        <Text className="font-pregular text-lg dark:text-white">Trình độ</Text>
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-center font-pextrabold text-lg dark:text-white">
                                {
                                    isModified()
                                        ? tempUser?.level
                                        : user?.level
                                }
                            </Text>
                            <AntDesign style={{ marginLeft: 6 }} size={20} name='right' color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="my-4 bottom-1">
                    {
                        isModified() &&
                        <CustomButton bgColor='bg-[#3749db]' onPress={handleUpdateUserInfo} text={"Cập nhật thông tin"} />
                    }
                </View>
                <LoadingModal visible={isVisibleModal} />
            </ScrollView>
            <BottomSheet enablePanDownToClose={false} snapPoints={['90%']} bottomSheetRef={bottomSheetRef}>
                {
                    isChanging == "gender" &&
                    <>
                        <View>
                            <Text className="font-pbold text-[28px] text-center dark:text-white">Giới tính của bạn</Text>
                        </View>

                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'male'
                                }))}
                                style={styles.imageContainer}>
                                <Image
                                    source={images["3d_male"]}
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'female'
                                }))}
                                style={styles.imageContainer}>
                                <Image
                                    source={images["3d_female"]}
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row justify-around items-center my-6">
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'male'
                                }))}
                            >
                                <Text className="font-pextrabold text-lg dark:text-white">Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'female'
                                }))}
                            >
                                <Text className="font-pextrabold text-lg dark:text-white">Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row justify-around items-center my-2">
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'male'
                                }))}
                            >
                                <AntDesign color={colorScheme == 'dark' ? '#fff' : '#000'} name={tempUser?.gender == 'male' ? 'checkcircle' : 'checkcircleo'} size={28} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((temp) => ({
                                    ...temp,
                                    gender: 'female'
                                }))}
                            >
                                <AntDesign color={colorScheme == 'dark' ? '#fff' : '#000'} name={tempUser?.gender == 'female' ? 'checkcircle' : 'checkcircleo'} size={28} />
                            </TouchableOpacity>
                        </View>
                        <View className="m-4 ">
                            <CustomButton onPress={handleDismissBottomSheet} bgColor='bg-[#3749db]' text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </>
                }

                {
                    isChanging == "weight" &&
                    <View className="">
                        <View >
                            <InputField
                                placeholder={user?.weight.toString()}
                                label={"Cân nặng"}
                                onChange={(value) => setTempUser({ ...tempUser, weight: value })}
                                keyboardType="numeric"
                                icon={<Ionicons name="body" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Kg'}
                            />
                        </View>
                        <View >
                            <InputField
                                placeholder={user?.targetWeight.toString()}
                                label={"Mục tiêu cân nặng"}
                                onChange={(value) => setTempUser({ ...tempUser, targetWeight: value })}
                                keyboardType="numeric"
                                icon={<MaterialCommunityIcons name="weight-lifter" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Kg'}
                            />
                        </View>
                        <View >
                            <InputField
                                placeholder={user?.height.toString()}
                                label={"Chiều cao"}
                                onChange={(value) => setTempUser({ ...tempUser, height: value })}
                                keyboardType="numeric"
                                icon={<MaterialCommunityIcons name="human-male-height" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Cm'}
                            />
                        </View>
                        <View className="mt-2">
                            <Text className={`text-lg font-psemibold dark:text-white`}>
                                Sinh năm
                            </Text>
                            <View className={`flex flex-row justify-between items-center relative bg-neutral-100 rounded-full border border-neutral-100 my-2`}>
                                <TouchableOpacity onPress={showDatepicker}>
                                    <Ionicons name="calendar-outline" size={24} style={{ marginLeft: 12 }} />
                                </TouchableOpacity>
                                <TextInput
                                    editable={false}
                                    className={`rounded-full p-4 font-pbold text-[15px] text-black flex-1 text-left`}
                                    value={date.toLocaleDateString()}
                                    placeholder={"Tuổi"}
                                    autoCapitalize={'none'}
                                />
                                <Text className="px-4">{calculateAge()} Tuổi</Text>

                            </View>
                        </View>
                        <View>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                        <View className="m-4 ">
                            <CustomButton onPress={() => {
                                handleDismissBottomSheet()
                                setTempUser((temp) => ({
                                    ...temp,
                                    age: calculateAge()
                                }))
                            }} bgColor='bg-[#3749db]' text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </View>
                }
                {
                    isChanging == 'healthGoal' &&
                    <>
                        <View className="flex">
                            <View>
                                <Text className="font-pbold text-[28px] text-center dark:text-white">Mục tiêu</Text>
                            </View>
                            <View className="h-[100px]"></View>
                            <TouchableOpacity
                                onPress={() => setTempUser((tempUser) => ({
                                    ...tempUser,
                                    healthGoal: "Tăng cơ"
                                }))}
                                className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.healthGoal == 'Tăng cơ' && 'border-[2px] border-[#000]'}`}>
                                <View className="flex flex-row justify-start items-center">
                                    <MaterialCommunityIcons name='arm-flex-outline' size={45} />
                                    <Text className="flex-1 ml-4 font-pextrabold text-lg">Tăng cơ</Text>
                                    {
                                        tempUser?.healthGoal == 'Tăng cơ' && <AntDesign name={'checkcircle'} size={28} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((tempUser) => ({
                                    ...tempUser,
                                    healthGoal: "Cân đối tổng thể"
                                }))}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.healthGoal == 'Cân đối tổng thể' && 'border-[2px] border-[#000]'}`}>
                                <Ionicons name='fitness-outline' size={45} />
                                <Text className="flex-1 ml-4 font-pextrabold text-lg">Cân đối</Text>
                                {
                                    tempUser?.healthGoal == 'Cân đối tổng thể' && <AntDesign name={'checkcircle'} size={28} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((tempUser) => ({
                                    ...tempUser,
                                    healthGoal: "Sức mạnh"
                                }))}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.healthGoal == 'Sức mạnh' && 'border-[2px] border-[#000]'} `}>
                                <MaterialCommunityIcons name='weight-lifter' size={45} />
                                <Text className="flex-1 ml-4 font-pextrabold text-lg">Sức mạnh</Text>
                                {
                                    tempUser?.healthGoal == 'Sức mạnh' && <AntDesign name={'checkcircle'} size={28} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTempUser((tempUser) => ({
                                    ...tempUser,
                                    healthGoal: "Giảm mỡ"
                                }))}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-2 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.healthGoal == 'Giảm mỡ' && 'border-[2px] border-[#000]'}`}>
                                <Ionicons name='trending-down' size={45} />
                                <Text className="flex-1 ml-4 font-pextrabold text-lg">Giảm mỡ</Text>
                                {
                                    tempUser?.healthGoal == 'Giảm mỡ' && <AntDesign name={'checkcircle'} size={28} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View className="mt-4">
                            <CustomButton onPress={handleDismissBottomSheet} bgColor='bg-[#3749db]' text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </>
                }
                {
                    isChanging == 'activityLevel' &&
                    <View>
                        <View className="flex">
                            <View>
                                <Text className="font-pbold text-[28px] text-center dark:text-white">Tầng suất hoạt động</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Ít vận động"],
                                        bmr: BMR(tempUser),
                                        tdee: (levelToPointMap["Ít vận động"] * BMR(tempUser))
                                    }))
                                }}
                                className={` bg-[#fff] mt-4 flex flex-row justify-between items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Ít vận động'] && 'border-[2px] border-[#000]'}`}>
                                <View className="flex flex-row justify-start items-center">
                                    <FontAwesome name='desktop' size={32} color={"#000"} />
                                    <Text className="flex-1 mx-4 font-pmedium text-[16px]">Ít vận động (ít hoặc không tập thể dục + làm việc văn phòng)</Text>
                                    {
                                        tempUser?.activityLevel == levelToPointMap['Ít vận động'] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Hoạt động nhẹ"],
                                        bmr: BMR(user),
                                        tdee: (levelToPointMap["Hoạt động nhẹ"] * BMR(user))
                                    }))
                                }}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Hoạt động nhẹ'] && 'border-[2px] border-[#000]'}`}>
                                <MaterialCommunityIcons name='clock-time-four-outline' size={32} color={"#000"} />
                                <Text className="flex-1 mx-4 font-pmedium text-[16px]">Hoạt động nhẹ (tập thể dục nhẹ 1-3 ngày / tuần)</Text>
                                {
                                    tempUser?.activityLevel == levelToPointMap['Hoạt động nhẹ'] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Tập thể dục vừa phải"],
                                        bmr: BMR(user),
                                        tdee: (levelToPointMap["Tập thể dục vừa phải"] * BMR(user))
                                    }))
                                }}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Tập thể dục vừa phải'] && 'border-[2px] border-[#000]'} `}>
                                <MaterialIcons name='directions-run' size={32} color={"#000"} />
                                <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục vừa phải (tập thể dục vừa phải 3-5 ngày / tuần)</Text>
                                {
                                    tempUser?.activityLevel == levelToPointMap['Tập thể dục vừa phải'] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Tập thể dục cường độ cao"],
                                        bmr: BMR(user),
                                        tdee: (levelToPointMap["Tập thể dục cường độ cao"] * BMR(user))
                                    }))
                                }}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Tập thể dục cường độ cao'] && 'border-[2px] border-[#000]'}`}>
                                <MaterialCommunityIcons name='dumbbell' size={32} color={"#000"} />

                                <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục hàng ngày hoặc tập thể dục cường độ cao 3-4 lần / tuần</Text>
                                {
                                    tempUser?.activityLevel == levelToPointMap['Tập thể dục cường độ cao'] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Tập thể dục nặng"],
                                        bmr: BMR(user),
                                        tdee: (levelToPointMap["Tập thể dục nặng"] * BMR(user))
                                    }))
                                }}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Tập thể dục nặng'] && 'border-[2px] border-[#000]'}`}>
                                <MaterialCommunityIcons name='weight-lifter' size={32} color={"#000"} />
                                <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục nặng (tập thể dục nặng 6-7 ngày / tuần)</Text>
                                {
                                    tempUser?.activityLevel == levelToPointMap['Tập thể dục nặng'] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUser((tempUser) => ({
                                        ...tempUser,
                                        activityLevel: levelToPointMap["Tập thể dục rất căng thẳng"],
                                        bmr: BMR(user),
                                        tdee: (levelToPointMap["Tập thể dục rất căng thẳng"] * BMR(user))
                                    }))
                                }}
                                className={`bg-[#fff] mt-4 flex flex-row justify-start items-center p-4 shadow-gray-600 shadow-lg border-[1px] rounded-lg border-[#ccc] ${tempUser?.activityLevel == levelToPointMap['Tập thể dục rất căng thẳng'] && 'border-[2px] border-[#000]'}`}>
                                <MaterialCommunityIcons name='fire' size={32} color={"#000"} />
                                <Text className="flex-1 mx-4 font-pmedium text-[16px]">Tập thể dục rất căng thẳng hàng ngày hoặc công việc thể chất, nặng nhọc</Text>
                                {
                                    tempUser?.activityLevel == levelToPointMap["Tập thể dục rất căng thẳng"] && <AntDesign name={'checkcircle'} size={28} color={"#000"} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View className="mt-4">
                            <CustomButton bgColor={`bg-[#3749db]`} onPress={handleDismissBottomSheet} text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </View>
                }
                {
                    isChanging == 'level' &&
                    <View>
                        <Text className="font-pbold text-[28px] text-center mb-4 dark:text-white">Kinh nghiệm</Text>

                        <TouchableOpacity
                            onPress={() => {
                                setTempUser((temp) => ({
                                    ...temp,
                                    level: "Người mới bắt đầu"
                                }))
                            }}
                            className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${tempUser.level == 'Người mới bắt đầu' && 'border-[2px] border-[#000]'}`}
                        >
                            <View className="flex flex-row justify-center items-center">
                                <FontAwesome name='battery-1' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex flex-1 ml-4 ">
                                <Text className="font-pextrabold text-lg dark:text-white">Người mới bắt đầu</Text>
                                <Text className="dark:text-white">Luyện tập ít hơn 6 tháng</Text>
                            </View>
                            {
                                tempUser.level == 'Người mới bắt đầu' && <AntDesign color={colorScheme == 'dark' ? '#fff' : '#000'} name={'checkcircle'} size={28} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setTempUser((temp) => ({
                                    ...temp,
                                    level: "Trung cấp"
                                }))
                            }}
                            className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${tempUser.level == 'Trung cấp' && 'border-[2px] border-[#000]'}`}
                        >
                            <View className="flex flex-row justify-center items-center">
                                <FontAwesome name='battery-2' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex flex-1 ml-4 mr-2">
                                <Text className="font-pextrabold text-lg dark:text-white">Trung cấp</Text>
                                <Text className="dark:text-white">Luyện tập hơn 6 tháng và ít hơn 2 năm</Text>
                            </View>
                            {
                                tempUser.level == 'Trung cấp' && <AntDesign color={colorScheme == 'dark' ? '#fff' : '#000'} name={'checkcircle'} size={28} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setTempUser((temp) => ({
                                    ...temp,
                                    level: "Thâm niên"
                                }))
                            }}
                            className={`flex flex-row justify-center items-center p-4 rounded-lg border-[1px] border-[#ccc] mb-3 ${tempUser.level == 'Thâm niên' && 'border-[2px] border-[#000]'}`}
                        >
                            <View className="flex flex-row justify-center items-center">
                                <FontAwesome name='battery-4' size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex flex-1 ml-4">
                                <Text className="font-pextrabold text-lg dark:text-white">Thâm niên</Text>
                                <Text className="dark:text-white">Hơn 2 năm luyện tập</Text>
                            </View>
                            {
                                tempUser.level == 'Thâm niên' && <AntDesign color={colorScheme == 'dark' ? '#fff' : '#000'} name={'checkcircle'} size={28} />
                            }
                        </TouchableOpacity>
                        <View className="mt-4">
                            <CustomButton bgColor={`bg-[#3749db]`} onPress={handleDismissBottomSheet} text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </View>
                }
                {
                    isChanging == 'orm' &&
                    <View className="p-4">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex flex-row justify-center items-center">
                                <Text className="font-pextrabold text-[28px] dark:text-white">1RM của tôi</Text>
                            </View>
                            <View className="flex justify-start items-center">
                                <Image
                                    source={{
                                        uri: urlSelected(selected)
                                    }}
                                    className="w-[320px] max-w-full h-[250px]"
                                    contentFit='contain'
                                />
                            </View>
                            <Text className="text-center font-pregular">Chỉ số sức mạnh cực đại cho 1 lần tập được gọi là ORM (One Repetition Maximum)</Text>
                            <View className="border-b-[0.5px] border-[#ccc]">
                                <View className="flex flex-row items-center p-2">
                                    <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Bài tạ</Text>
                                    <View className="">
                                        <SelectList
                                            boxStyles={{
                                                marginTop: 12,
                                                width: 150,
                                                borderColor: colorScheme == 'dark' ? '#fff' : "#000",
                                                backgroundColor: colorScheme == 'dark' ? "#000" : "#fff",
                                                borderWidth: 1,
                                            }}
                                            inputStyles={{
                                                color: colorScheme == 'dark' ? '#fff' : "#000",
                                            }}
                                            dropdownStyles={{
                                                backgroundColor: colorScheme == 'dark' ? "#000" : "#fff",
                                                borderColor: colorScheme == 'dark' ? "#fff" : "#000",
                                            }}
                                            arrowicon={
                                                <AntDesign
                                                    name='arrowdown'
                                                    color={colorScheme == 'dark' ? '#fff' : "#000"}
                                                    size={18}
                                                />
                                            }
                                            dropdownTextStyles={{
                                                color: colorScheme == 'dark' ? '#fff' : '#000'
                                            }}
                                            setSelected={(item) => {
                                                setSelected(item)
                                            }}
                                            data={seedDataOrm}
                                            placeholder={selected}
                                            save="value"
                                            search={false}
                                        />
                                    </View>
                                </View>
                                <View className="flex flex-row justify-between items-center p-2">
                                    <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Nâng tạ</Text>
                                    <View className='flex flex-row justify-end items-center flex-1'>
                                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <TextInput
                                                    className={`bg-[#ccc] mr-2 font-bold my-2 dark:text-white rounded-lg p-2 text-lg flex-1 text-left`}
                                                    keyboardType='numeric'
                                                    onChangeText={(weight) => setWeight(weight)}
                                                    placeholder={user?.orm.toString()}
                                                />
                                            </TouchableWithoutFeedback>
                                        </KeyboardAvoidingView>
                                        <TouchableOpacity
                                            // onPress={() => changeToLbs()}
                                            className="flex flex-row justify-center items-center w-[40px]"
                                        >
                                            <Text className="font-pmedium dark:text-white">
                                                {isLbs ? 'lbs' : 'kg'}
                                            </Text>
                                            <Entypo name="select-arrows" size={20} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className="flex flex-row justify-between items-center p-2">
                                    <Text className="font-pmedium text-[16px] flex-1 dark:text-white">Khi mệt tôi có thể nâng</Text>
                                    <View className='flex flex-row justify-end items-center flex-1'>
                                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <TextInput
                                                    className={`bg-[#ccc] mr-2 font-bold my-2 dark:text-white rounded-lg p-2 text-lg flex-1 text-left`}
                                                    keyboardType='numeric'
                                                    value={reps}
                                                    placeholder={`${reps}`}
                                                    onChangeText={(rep) => setReps(rep)}
                                                />
                                            </TouchableWithoutFeedback>
                                        </KeyboardAvoidingView>
                                        <View
                                            className="flex flex-row justify-center items-center w-[40px]"
                                        >
                                            <Text className="font-pmedium dark:text-white">
                                                Hiệp
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="">
                                <View className="flex flex-row justify-between items-center p-2">
                                    <View className="flex">
                                        <Text className="font-pbold text-lg dark:text-white">1RM của bạn</Text>
                                        <Text className="font-pregular text-[12px] dark:text-white">({selected})</Text>
                                    </View>
                                    <View className='flex flex-row justify-end items-center flex-1'>
                                        <Text className="font-pbold text-lg mr-2 dark:text-white">
                                            {calculate1RM(weight, reps, selected)}
                                        </Text>
                                        <Text className="font-pregular dark:text-white">{isLbs ? 'lbs' : 'kg'}</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        <CustomButton onPress={() => {
                            setTempUser({ ...tempUser, orm: calculate1RM(weight, reps, selected) })
                            bottomSheetRef?.current?.dismiss()
                        }} bgColor='bg-[#3749db]' text={'Xong'} />
                    </View>
                }
            </BottomSheet>
        </SafeAreaView >
    )
}

export default MyProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.4,
        height: width * 0.9,

    },
});