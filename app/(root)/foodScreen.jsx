import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { getAllFoods } from '../../libs/mongodb'
import { FlatList } from 'react-native-gesture-handler'
import FoodCard from '../../components/FoodCard'
import BottomSheet from '../../components/BottomSheet'
import Slider from '@react-native-community/slider';
const FoodScreen = () => {

    const [isSearching, setIsSearching] = useState(false)
    const [smallLoading, setSmallLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        Calories: 0,
        Protein: 0,
        Fat: 0,
        Carbonhydrates: 0,
        Weight: 0
    })
    const [foods, setFoods] = useState([])
    const { colorScheme } = useColorScheme()
    const [isLoading, setIsLoading] = useState(true)
    const [skip, setSkip] = useState(0)
    const limit = 10
    const bottomSheetRefFilter = useRef(null)

    const handleToggleSearching = () => {
        setIsSearching(!isSearching)
        setForm((form) => ({
            ...form,
            name: ""
        }))
    }

    const handlePresentFilterModal = () => {
        bottomSheetRefFilter?.current?.present()
    }

    const fetchAllFoodsData = async (isSearchReset = false) => {
        setSmallLoading(true)
        try {
            if (isSearchReset) {
                setIsLoading(true);
                setSkip(0);
                setFoods([])
            }
            const res = await getAllFoods({
                limit: limit,
                skip: isSearchReset ? 0 : skip,
                name: form.name,
                Calories: form.Calories,
                Protein: form.Protein,
                Fat: form.Fat,
                Carbonhydrates: form.Carbonhydrates,
                Weight: form.Weight
            })

            const newFoodsData = res.data;

            setFoods((prev) => isSearchReset ? newFoodsData : [...prev, ...newFoodsData]);

            if (newFoodsData.length > 0) {
                setSkip((prevSkip) => prevSkip + limit);
            }

        } catch (error) {
            Alert.alert("Lỗi", error.message)
        } finally {
            setSmallLoading(false)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchAllFoodsData(true)
        }, 1000);

        return () => {
            clearTimeout(debounceTimeout)
        };
    }, [form])

    return (
        <View className="px-4 pt-2 h-full dark:bg-slate-950">
            {
                isSearching ? (
                    <View className="shadow-lg flex flex-row justify-between items-center">
                        <TextInput
                            className="p-3 rounded-lg bg-neutral-200 flex-1 mr-3"
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
            <View className="flex flex-row justify-between items-center my-3">
                <View>
                    <TouchableOpacity onPress={handlePresentFilterModal} className="rounded-lg flex flex-row items-center justify-center bg-neutral-200 p-2">
                        <Ionicons name='filter-sharp' size={20} />
                        <Text className="font-pmedium ml-1">Lọc</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity disabled={foods?.length > 0 ? false : true} onPress={() => {
                    setSkip(0)
                    setForm({
                        name: "",
                        Calories: 0,
                        Protein: 0,
                        Fat: 0,
                        Carbonhydrates: 0,
                        Weight: 0
                    })
                }}>
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
                        data={foods}
                        renderItem={({ item, index }) => {
                            return (
                                <FoodCard food={item} />
                            )
                        }}
                        ItemSeparatorComponent={
                            <View className="h-[16px]"></View>
                        }
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            !smallLoading ?
                                <TouchableOpacity className='p-4 flex flex-row justify-center items-center' onPress={() => fetchAllFoodsData(false)}>
                                    <Ionicons name='reload' size={30} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                                </TouchableOpacity>
                                :
                                <ActivityIndicator size={'large'} animating={smallLoading} style={{ marginTop: 12 }} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        }
                    />
                )
            }
            <BottomSheet title="Lọc thực phẩm" enablePanDownToClose={false} snapPoints={['100%']} bottomSheetRef={bottomSheetRefFilter}>
                <View className="flex p-2">
                    <View className="flex flex-row p-2">
                        <Text className="">Calo {`<=`}</Text>
                        <Text className="font-pbold"> {Number(form.Calories).toFixed()}</Text>
                    </View>
                    <Slider
                        value={form.Calories}
                        onValueChange={(value) => setForm((form) => ({ ...form, Calories: value }))}
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={1000}
                        thumbTintColor='#3749db'
                        minimumTrackTintColor="#3749db"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View className="flex p-2">
                    <View className="flex flex-row p-2">
                        <Text className="">Chất đạm {`<=`}</Text>
                        <Text className="font-pbold"> {Number(form.Protein).toFixed()}</Text>
                    </View>
                    <Slider
                        value={form.Protein}
                        onValueChange={(value) => setForm((form) => ({ ...form, Protein: value }))}
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor='#3749db'
                        minimumTrackTintColor="#3749db"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View className="flex p-2">
                    <View className="flex flex-row p-2">
                        <Text className="">Chất béo {`<=`}</Text>
                        <Text className="font-pbold"> {Number(form.Fat).toFixed()}</Text>
                    </View>
                    <Slider
                        value={form.Fat}
                        onValueChange={(value) => setForm((form) => ({ ...form, Fat: value }))}
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor='#3749db'
                        minimumTrackTintColor="#3749db"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View className="flex p-2">
                    <View className="flex flex-row p-2">
                        <Text className="">Carb {`<=`}</Text>
                        <Text className="font-pbold"> {Number(form.Carbonhydrates).toFixed()}</Text>
                    </View>
                    <Slider
                        value={form.Carbonhydrates}
                        onValueChange={(value) => setForm((form) => ({ ...form, Carbonhydrates: value }))}
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor='#3749db'
                        minimumTrackTintColor="#3749db"
                        maximumTrackTintColor="#000000"
                    />
                </View>
            </BottomSheet>
        </View>
    )
}

export default FoodScreen

const styles = StyleSheet.create({})