import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native'
import React from 'react'
// import { Image } from 'expo-image'
import { images } from '../constants/image'
import PlanCard from './PlanCard'

const PlanList = ({ plan }) => {
    return (
        <View className="p-4 flex flex-1 h-full border-[1px] border-red-500">
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

            <FlatList
                data={plan?.trainings}
                renderItem={({ item, index }) => (
                    <PlanCard item={item} />
                )}
            />
        </View>
    )
}

export default PlanList

const styles = StyleSheet.create({
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
