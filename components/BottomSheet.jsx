import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from 'nativewind';

const BottomSheet = ({ bottomSheetRef, children, snapPoints = ['25%'] }) => {
    const { colorScheme } = useColorScheme()
    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={[...snapPoints ?? '25%']}
                stackBehavior='replace'
                enableDismissOnClose={true}
                handleIndicatorStyle={{
                    backgroundColor: colorScheme == 'dark' ? "#fff" : 'rgb(2,6,23)',
                }}
                handleStyle={{
                    borderColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#000',
                    backgroundColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                    borderTopWidth: 0.5
                }}
                style={{
                    borderRadius: 12,
                    zIndex: 100,
                    backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff',
                    borderColor: '#000'
                }}
            >
                {children}
            </BottomSheetModal>
        </BottomSheetModalProvider>


    )
}

export default BottomSheet

const styles = StyleSheet.create({})