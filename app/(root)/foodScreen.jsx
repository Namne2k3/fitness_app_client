import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { Image } from 'expo-image'
import { getAllFoods } from '../../libs/mongodb'
import { FlatList } from 'react-native-gesture-handler'
const FoodScreen = () => {

    const [isSearching, setIsSearching] = useState(false)
    const [form, setForm] = useState({
        name: "",
        Calories: undefined,
        Protein: undefined,
        Fat: undefined,
        Carbonhydrates: undefined,
        Weight: undefined
    })
    const [foods, setFoods] = useState([])
    const { colorScheme } = useColorScheme()
    const [isLoading, setIsLoading] = useState(false)
    const [skip, setSkip] = useState(0)
    const limit = 20

    const handleToggleSearching = () => {
        setIsSearching(!isSearching)
        setForm((form) => ({
            ...form,
            name: ''
        }))
    }

    useEffect(() => {
        const fetchAllFoodsData = async (isSearchReset = false) => {
            try {
                if (isSearchReset) {
                    setIsLoading(true);
                    setSkip(0);
                    setFoods([])
                }

                const res = await getAllFoods({
                    limit: limit,
                    skip: skip,
                    name: form.name,
                    Calories: form.Calories,
                    Protein: form.Protein,
                    Fat: form.Fat,
                    Carbonhydrates: form.Carbonhydrates,
                    Weight: form.Weight
                })

                const newFoodsData = res.data;
                console.log("newFoodsData >>> ", newFoodsData?.length);

                setFoods((prev) => isSearchReset ? newFoodsData : [...prev, ...newFoodsData]);

                if (newFoodsData?.length > 0) {
                    setSkip((prevSkip) => prevSkip + limit);
                }

            } catch (error) {
                Alert.alert("Lỗi", error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAllFoodsData()
    }, [])

    return (
        <View className="px-4 pt-4 h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-[#fff] flex-1 mr-3"
                            color={'#000'}
                            value={form.name}
                            placeholder='Tìm kiếm tên thực phẩm...'
                            onChangeText={(text) => setForm((form) => ({
                                ...form,
                                name: text
                            }))}
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
                        <Text className="font-pextrabold text-[32px] dark:text-white uppercase">thực phẩm</Text>
                        <View>
                            <TouchableOpacity onPress={handleToggleSearching}>
                                <FontAwesome name='search' size={26} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            <View className="flex flex-row justify-between items-center my-2">
                <View>
                    <TouchableOpacity className="rounded-lg flex flex-row items-center justify-center bg-neutral-200 p-2">
                        <Ionicons name='filter-sharp' size={20} />
                        <Text className="font-pmedium ml-1">Lọc</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity>
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

                    />
                )
            }
        </View>
    )
}

export default FoodScreen

const styles = StyleSheet.create({})