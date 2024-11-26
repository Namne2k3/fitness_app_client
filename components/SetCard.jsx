import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'

const SetCard = ({ index, item: { kilogram, reps, isCheck }, handleUpdateIsCheck, handleUpdateKilogramAndReps, itemParent, hasCheck, setIsCheck, isNeedKg }) => {

    const { colorScheme } = useColorScheme()

    return (
        <View className={`flex flex-row justify-between items-center w-full ${isCheck ? 'bg-[#239140]' : colorScheme == 'dark' ? 'bg-slate-700' : 'bg-[#f5f4f5]'} px-4 py-1 rounded-[20px]`}>

            {
                hasCheck &&
                <TouchableOpacity className="p-3" onPress={() => handleUpdateIsCheck(itemParent, index, !isCheck)}>
                    {
                        isCheck
                            ?
                            <AntDesign name='checkcircle' size={20} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                            :
                            <AntDesign name='checkcircleo' size={20} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                    }
                </TouchableOpacity>
            }

            <Text className={`font-pextrabold text-lg dark:text-white ${isCheck && 'text-white'}`}>{index + 1}</Text>
            {
                isNeedKg &&
                <>
                    <View className='flex flex-[0.5] mx-4'>
                        <TextInput
                            value={`${Number(kilogram)}`}
                            className={`font-bold my-2 dark:text-white rounded-[16px] p-4 text-[15px] ${isCheck ? 'bg-[#2ba818]' : 'bg-[#e6e4e8]'} flex-1 text-left ${isCheck ? 'text-white' : 'text-black'}`}
                            keyboardType='numeric'
                            onChangeText={(text) => handleUpdateKilogramAndReps(itemParent, index, Number(text), Number(reps))}
                        />
                    </View>
                    <Text className={`font-bold text-md dark:text-white ${isCheck && 'text-white'}`}>KG</Text>
                </>
            }
            <View className='flex flex-[0.5] mx-4'>
                <TextInput
                    value={`${Number(reps)}`}
                    className={`font-bold my-2 rounded-[16px] p-4 text-[15px] ${isCheck ? 'bg-[#2ba818]' : 'bg-[#e6e4e8]'} flex-1 text-left ${isCheck ? 'text-white' : 'text-black'}`}
                    keyboardType='numeric'
                    onChangeText={(text) => handleUpdateKilogramAndReps(itemParent, index, Number(kilogram), Number(text))}
                />
            </View>
            <Text className={`font-bold dark:text-white text-md ${isCheck && 'text-white'}`}>Hiệp</Text>
        </View>
    )
}

export default SetCard

const styles = StyleSheet.create({})