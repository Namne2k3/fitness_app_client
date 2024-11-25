import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet, ImageBackground, FlatList } from "react-native";
import useUserStore from '../store/userStore'
import { getAllPlansByUserId } from '../libs/mongodb'
import Swiper from 'react-native-swiper';
import PlanList from "./PlanList";
import { images } from "../constants/image";
import PlanCard from "./PlanCard";
import LoadingModal from "./LoadingModal";
import { router } from 'expo-router'

const Plan = () => {

    const [plans, setPlans] = useState([])
    const { user, setUser } = useUserStore()
    const [active, setActive] = useState(2)
    const [isLoading, setIsLoading] = useState(false)

    const handleNavigateDetail = useCallback((id, index) => {

        if (active < index) {
            Alert.alert("Bạn cần phải hoàn thành các bài tập trước!")
        }
        else {
            router.push(`/(root)/TrainingDetails/${id}?index=${index}`)
        }
    }, [])

    const fetchAllPlansByUserId = async () => {
        setIsLoading(true)
        try {
            const res = await getAllPlansByUserId();
            if (res.data) {
                setPlans(res.data)
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {

        fetchAllPlansByUserId()
    }, [])

    return (
        <View className="flex-1">
            <Swiper
                showsPagination={false}
                paginationStyle={styles.paginationStyle} // Custom style for pagination
                loop={false}
                dotStyle={styles.dotStyle} // Style for inactive dots
                activeDotStyle={styles.activeDotStyle} // Style for active dot
                pagingEnabled={true}
            >
                {plans?.map((plan, index) => {

                    return (
                        <React.Fragment key={`${plan?.name}_${index}`}>
                            <View className="p-4 pb-8">
                                <ImageBackground
                                    source={images.plan_background}
                                    resizeMode="cover"
                                    style={styles.backgroundImage}
                                >
                                    <View style={styles.overlay}>
                                        <Text className="text-white font-pextrabold text-[22px] uppercase">{plan?.name || "Default Plan Name"}</Text>
                                        <Text className="text-white font-pextrabold text-md uppercase mt-1">30
                                            <Text className="text-[#9a9da2] font-pmedium capitalize"> Ngày</Text>
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </View>

                            <FlatList
                                data={plan?.trainings}
                                renderItem={({ item, index }) => (
                                    <PlanCard handleNavigateDetail={(id, index) => handleNavigateDetail(id, index)} index={index} active={active} isActive={active == index} item={item} />
                                )}
                                keyExtractor={(item) => `${item?.title}_${index}`}
                                ItemSeparatorComponent={
                                    <View className="h-[16px]"></View>
                                }
                                contentContainerStyle={{
                                    padding: 16,
                                    paddingTop: 0
                                }}
                                showsVerticalScrollIndicator={false}
                            />
                        </React.Fragment>
                    )
                })}
            </Swiper>
            <LoadingModal visible={isLoading} />
        </View>
    )
}
const styles = StyleSheet.create({
    paginationStyle: {
        // top: -200, // Adjust the position of the pagination
        bottom: 50,
        alignSelf: 'center', // Center the pagination
    },
    dotStyle: {
        backgroundColor: '#ccc', // Style for inactive dots
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDotStyle: {
        backgroundColor: '#3649d9', // Style for active dot
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    backgroundImage: {
        width: '100%', // Chiều rộng của hình nền
        height: 180,   // Chiều cao của hình nền
        borderRadius: 10, // Tạo góc bo tròn
        overflow: 'hidden', // Ẩn góc ảnh tràn ra ngoài
    },
    overlay: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-end',
        alignItems: "flex-start",
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Tạo hiệu ứng mờ overlay nếu cần
    },
});

export default Plan