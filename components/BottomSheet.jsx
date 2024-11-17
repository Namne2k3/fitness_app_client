import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet } from 'react-native';

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