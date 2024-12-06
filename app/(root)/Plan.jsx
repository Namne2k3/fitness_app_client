import React, { useEffect, useState } from "react";
import { Alert, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import Swiper from 'react-native-swiper';
import { images } from "../../constants/image";
import { getAllPlansByUserId } from '../../libs/mongodb';
import useUserStore from '../../store/userStore';
import usePlanStore from '../../store/usePlanStore';
import LoadingModal from "../../components/LoadingModal";
import PlanCard from "../../components/PlanCard";
import { useLocalSearchParams } from "expo-router";

const Plan = () => {

    const { plans, setPlans } = usePlanStore()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchPlans = async () => {

            try {
                setIsLoading(true)

                const res = await getAllPlansByUserId();
                if (res.data) {
                    console.log("Plans length >>> ", res.data.length);

                    setPlans(res.data); // Lưu vào Zustand
                }
            } catch (error) {
                Alert.alert("Lỗi", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans()

    }, []);

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
                            <View className="m-4">
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
                                    <PlanCard planId={plan?._id} current={plan.current} index={index} item={item} />
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