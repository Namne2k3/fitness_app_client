import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from 'nativewind';

const BottomSheetModalComponent = ({ selectedExercise, bottomSheetRef }) => {

    const { colorScheme } = useColorScheme()

    return (
        <BottomSheetModalProvider>

            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={['65%', '95%']}
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
                    borderWidth: 0
                }}
                style={{
                    borderWidth: 1,
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
                    <View className="flex justify-center items-center rounded-lg" >
                        <Image
                            source={{
                                uri: selectedExercise?.gifUrl
                            }}
                            className="w-full min-h-[300px]"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="font-pextrabold text-lg capitalize mt-4 dark:text-white">{selectedExercise?.name}</Text>
                    <Text className="font-pbold text-lg mt-2 dark:text-white">
                        * Mục tiêu: <Text className="font-pregular">{selectedExercise?.target} {selectedExercise?.secondaryMuscles?.map((mus, index) =>
                            <Text key={index}>
                                , {mus}
                            </Text>)}
                        </Text>
                    </Text>
                    <Text className="font-pbold text-lg mt-2 dark:text-white">
                        * Thiết bị:
                        <Text className="font-pregular">
                            {` ${selectedExercise?.equipment}`}
                        </Text>
                    </Text>

                    <View>
                        <Text className="font-pextrabold text-lg mt-3 dark:text-white">* Hướng dẫn</Text>
                        {
                            selectedExercise?.instructions?.map((ins, index) => (
                                <View className="flex flex-row mt-3" key={index}>
                                    <Text className="flex-[10%] font-pextrabold text-lg dark:text-white">{index + 1}</Text>
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