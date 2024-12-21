import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const BottomSheet = ({ onDismiss, title, bottomSheetRef, children, snapPoints = ['25%'], enablePanDownToClose }) => {
    const { colorScheme } = useColorScheme();

    const handleClose = () => {
        bottomSheetRef?.current?.dismiss();
    };

    return (
        <BottomSheetModalProvider enableDismissOnClose={true}>
            <BottomSheetModal
                onDismiss={onDismiss}
                enableBackdropPress={true}
                enablePanDownToClose={enablePanDownToClose}
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                stackBehavior="replace"
                enableDismissOnClose={true}
                handleIndicatorStyle={{
                    backgroundColor: colorScheme == 'dark' ? "#fff" : 'rgb(2,6,23)',
                }}
                handleStyle={{
                    borderColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#000',
                    backgroundColor: colorScheme == 'dark' ? "rgb(2,6,23)" : '#fff',
                }}
                style={{
                    borderRadius: 12,
                    zIndex: 100,
                    backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff',
                    borderColor: '#000',
                }}
                ba
            >
                <BottomSheetScrollView
                    contentContainerStyle={{
                        padding: 16,
                        backgroundColor: colorScheme == 'dark' ? '#000' : '#fff'
                    }}
                >
                    <View className="flex flex-row justify-between items-center pb-4">
                        <Text className="font-pbold text-lg uppercase dark:text-white">{title ?? ""}</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <AntDesign name="close" size={28} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    {children}
                </BottomSheetScrollView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

export default BottomSheet;
