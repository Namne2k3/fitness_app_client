import { Text, View, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
const { width } = Dimensions.get('window');
import { Image } from 'expo-image'

const FoodCard = ({ food }) => {
    return (
        <View className="bg-[#fff] p-2 rounded-lg flex flex-row items-center justify-between dark:bg-[#292727]">
            <View className="mr-2 flex-1 justify-center items-center flex rounded-lg">
                <Image
                    source={{
                        uri: food.image
                    }}
                    contentFit='contain'
                    style={styles.image}
                />
            </View>
            <View className='flex flex-1'>
                <Text className="text-[22px] font-pbitalic mb-2 dark:text-white">{food.name}</Text>
                <View>
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pregular capitalize dark:text-white">Calo</Text>
                        <Text className="font-pbold dark:text-white"> {food.Calories}g</Text>
                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pregular capitalize dark:text-white">Chất đạm</Text>
                        <Text className="font-pbold dark:text-white"> {food.Protein}g</Text>
                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pregular capitalize dark:text-white">chất béo</Text>
                        <Text className="font-pbold dark:text-white"> {food.Fat}g</Text>
                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pregular capitalize dark:text-white">Carb</Text>
                        <Text className="font-pbold dark:text-white"> {food.Carbonhydrates}g</Text>
                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <Text className="font-pregular capitalize dark:text-white">Trọng lượng</Text>
                        <Text className="font-pbold dark:text-white"> {food.Weight}g</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default FoodCard


const styles = StyleSheet.create({
    image: {
        width: width * 0.4,
        height: width * 0.3
    }
})