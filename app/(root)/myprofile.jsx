import { AntDesign, Entypo, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, ScrollView, View, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, Keyboard, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomSheet from '../../components/BottomSheet'
import CustomButton from '../../components/CustomButton'
import InputField from '../../components/InputField'
import LoadingModal from '../../components/LoadingModal'
import { images } from '../../constants/image'
import { uploadFile } from '../../libs/appwrite'
import { getAllExercises, handleUpdateUser, reCreatePlans, reCreateTrainingsByUserId, updateUserById } from '../../libs/mongodb'
import useUserStore from '../../store/userStore'
import { calculate1RM, createPlansForUser, generateTrainings } from '../../utils'
import { SelectList } from 'react-native-dropdown-select-list'
const { width } = Dimensions.get('window');

const seedData = [
    {
        name: "Bench Press",
        value: "Bench Press",
        url: "https://drive.google.com/uc?id=13ibeDSBV0wx7lpYJI9f2N2xc85ky0ztc"
    },
    {
        name: "Deadlift",
        value: "Deadlift",
        url: "https://drive.google.com/uc?id=16To7ZKpunF0vQugU4oPsrm3NAjA1Fzzf"
    },
    {
        name: "Squats",
        value: "Squats",
        url: "https://drive.google.com/uc?id=1vqA6d5AQw336tvhRuY3SeizWK7GZtyVx"
    }
]

function urlSelected(name) {
    let selected = {}
    seedData.forEach((item) => {
        if (item.name == name)
            selected = item
    })

    return selected.url;
}

const MyProfile = () => {

    const { user, setUser } = useUserStore()
    const [tempUser, setTempUser] = useState({})
    const { colorScheme } = useColorScheme()
    const [isChanging, setIsChanging] = useState("")
    const [gender, setGender] = useState(user?.gender)
    const [profileImage, setProfileImage] = useState({})
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [isRecreating, setIsRecreating] = useState(false)
    const bottomSheetRef = useRef(null);
    const [selected, setSelected] = useState(seedData[0].name)
    const [isLbs, setIsLbs] = useState(false)
    const [weight, setWeight] = useState(Number(0))
    const [reps, setReps] = useState(Number(1))

    const isModified = () => {
        return JSON.stringify(user) !== JSON.stringify(tempUser)
    }

    const openPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });


        if (result.canceled) {

        } else {

            setProfileImage(result.assets[0])
        }
    }

    const handleUpdateUserImage = async () => {
        setIsVisibleModal(true)
        try {
            // upload file image
            const imageUrl = await uploadFile(profileImage, profileImage?.type)
            const updatedUser = await handleUpdateUser({ ...user, image: imageUrl.fileUrl })
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

    const handleUpdateGender = (gender) => {
        try {
            setGender(gender)
        } catch (error) {
            Alert.alert('Lỗi', error.message)
        }
    }

    const handleOnlyUpdateInfo = async () => {
        setIsVisibleModal(true)
        try {
            const res = await updateUserById(tempUser)
            console.log("Check res >>> ", res);

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
            const updatedUser = await updateUserById(tempUser)

            const createdTrainings = await generateTrainings(tempUser, data)

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

    useEffect(() => {
        console.log("Chay lan 1");
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
                        <Text className="font-pregular text-[12px] dark:text-white">Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={
                            colorScheme == 'dark'
                                ? `flex-1 bg-[#000] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                                : `flex-1 bg-[#ccc] rounded-full border-[1.5px] p-2 mx-2 justify-center items-center`
                        }
                        onPress={() => setProfileImage({})}
                    >
                        <Text className="font-pregular text-[12px] dark:text-white">Cancel</Text>
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
                    <Text className="dark:text-white font-pmedium">ORM (Bench Press)</Text>
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
            </View>
            <View className="my-4 bottom-1">
                {
                    isModified() &&
                    <CustomButton bgColor='bg-[#3749db]' onPress={handleUpdateUserInfo} text={"Cập nhật thông tin"} />
                }
            </View>
            <LoadingModal visible={isVisibleModal} />
            <BottomSheet enablePanDownToClose={false} snapPoints={['95%']} bottomSheetRef={bottomSheetRef}>
                {
                    isChanging == "gender" &&
                    <>
                        <View>
                            <Text className="font-pbold text-[28px] text-center">Giới tính của bạn</Text>
                        </View>

                        <View style={styles.genderContainer}>
                            <TouchableOpacity onPress={() => handleUpdateGender('male')} style={styles.imageContainer}>
                                <Image
                                    source={images["3d_male"]}
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateGender('female')} style={styles.imageContainer}>
                                <Image
                                    source={images["3d_female"]}
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row justify-around items-center my-6">
                            <TouchableOpacity onPress={() => handleUpdateGender('male')}>
                                <Text className="font-pextrabold text-lg">Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateGender('female')}>
                                <Text className="font-pextrabold text-lg">Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row justify-around items-center my-2">
                            <TouchableOpacity onPress={() => handleUpdateGender('male')} >
                                <AntDesign name={gender == 'male' ? 'checkcircle' : 'checkcircleo'} size={28} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateGender('female')}>
                                <AntDesign name={gender == 'female' ? 'checkcircle' : 'checkcircleo'} size={28} />
                            </TouchableOpacity>
                        </View>
                        <View className="m-4 ">
                            <CustomButton onPress={() => {
                                setTempUser({
                                    ...tempUser,
                                    gender: gender
                                })
                                bottomSheetRef?.current?.dismiss()
                            }} bgColor='bg-[#3749db]' text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </>
                }

                {
                    isChanging == "weight" &&
                    <>
                        <View className="p-4">
                            <InputField
                                placeholder={user?.weight.toString()}
                                label={"Cân nặng"}
                                onChange={(value) => setTempUser({ ...tempUser, weight: value })}
                                keyboardType="numeric"
                                icon={<Ionicons name="body" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Kg'}
                            />
                        </View>
                        <View className="p-4">
                            <InputField
                                placeholder={user?.targetWeight.toString()}
                                label={"Mục tiêu cân nặng"}
                                onChange={(value) => setTempUser({ ...tempUser, targetWeight: value })}
                                keyboardType="numeric"
                                icon={<MaterialCommunityIcons name="weight-lifter" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Kg'}
                            />
                        </View>
                        <View className="p-4">
                            <InputField
                                placeholder={user?.height.toString()}
                                label={"Chiều cao"}
                                onChange={(value) => setTempUser({ ...tempUser, height: value })}
                                keyboardType="numeric"
                                icon={<MaterialCommunityIcons name="human-male-height" size={24} style={{ marginLeft: 12 }} />}
                                textRight={'Cm'}
                            />
                        </View>
                        <View className="m-4 ">
                            <CustomButton onPress={handleDismissBottomSheet} bgColor='bg-[#3749db]' text="Xong" textStyle={{
                                fontFamily: "Roboto-Bold"
                            }} />
                        </View>
                    </>
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
                                            data={seedData}
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
    // title: {
    //     fontFamily: 'Poppins-ExtraBold', // Thay font của bạn
    //     fontSize: 30,
    //     textAlign: 'center',
    // },
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
        width: width * 0.4, // Chiều rộng là 40% màn hình
        height: width * 0.9, // Giữ tỷ lệ vuông

    },
});