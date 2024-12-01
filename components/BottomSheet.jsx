import React from 'react';
import { View, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
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
                    borderRadius: 12,
                }}
                style={{
                    borderRadius: 12,
                    zIndex: 100,
                    backgroundColor: colorScheme == 'dark' ? 'rgb(2,6,23)' : '#fff',
                    borderColor: '#000',
                }}
            >
                <View>
                    <View className="flex flex-row justify-between items-center px-4">
                        <Text className="font-pbold text-lg uppercase">{title ?? ""}</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <AntDesign name="close" size={28} />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

export default BottomSheet;
