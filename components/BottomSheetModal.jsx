import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from 'nativewind';
import { AntDesign } from '@expo/vector-icons';

const BottomSheetModalComponent = ({ selectedExercise, bottomSheetRef, snapPoints = ['95%'] }) => {

    const { colorScheme } = useColorScheme()

    return (
        <BottomSheetModalProvider>

            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                stackBehavior='replace'
                enableDismissOnClose={true}
                handleIndicatorStyle={{
                    backgroundColor: colorScheme == 'dark' ? "#fff" : 'rgb(2,6,23)',
                }}
                handleStyle={{
                    borderColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                    backgroundColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    borderWidth: 1
                }}
                style={{
                    // borderWidth: 0.5,
                    borderColor: colorScheme == 'dark' ? '#fff' : '#000',
                    borderRadius: 12,
                    zIndex: 100,
                    backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff'
                }}
            >
                <BottomSheetScrollView
                    horizontal={false}
                    contentContainerStyle={{
                        padding: 16,
                    }}
                    style={{
                        backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff'
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex flex-row justify-end items-center pb-4">
                        <TouchableOpacity onPress={() => bottomSheetRef?.current?.dismiss()}>
                            <AntDesign name="close" size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex justify-center items-center rounded-lg" >
                        <Image
                            source={{
                                uri: selectedExercise?.gifUrl
                            }}
                            className="w-full min-h-[300px]"
                            contentFit="contain"
                        />
                    </View>
                    <Text className="font-pextrabold text-lg capitalize mt-4 dark:text-white">{selectedExercise?.name}</Text>
                    <Text className="font-pbold text-lg mt-2 dark:text-white">
                        Mục tiêu: <Text className="font-pregular capitalize">{selectedExercise?.target} {selectedExercise?.secondaryMuscles?.map((mus, index) =>
                            <Text key={index} className='font-pregular capitalize'>
                                , {mus}
                            </Text>)}
                        </Text>
                    </Text>
                    <Text className="font-pbold text-lg mt-2 dark:text-white">
                        Thiết bị:
                        <Text className="font-pregular capitalize">
                            {` ${selectedExercise?.equipment}`}
                        </Text>
                    </Text>

                    <View>
                        <Text className="font-pextrabold text-lg mt-2 dark:text-white">Các bước</Text>
                        {
                            selectedExercise?.instructions?.map((ins, index) => (
                                <View className="flex flex-row mt-3 justify-center items-center" key={index}>
                                    <Text className="flex-[10%] font-pextrabold text-[24px] border-[0.5px] text-center rounded-lg mr-4 dark:text-white dark:border-[#fff]">{index + 1}</Text>
                                    <Text className="flex-[90%] font-pmedium dark:text-white">{ins}</Text>
                                </View>
                            ))
                        }
                    </View>

                </BottomSheetScrollView>
            </BottomSheetModal>

        </BottomSheetModalProvider>
    )
}

export default BottomSheetModalComponent

const styles = StyleSheet.create({})