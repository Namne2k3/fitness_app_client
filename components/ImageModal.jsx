import React from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
const ImageModal = ({ smallIsDownload, handleDownloadImage, visibleImageModal, closeModal, selectedImage }) => {


    return (
        <Modal
            visible={visibleImageModal}
            transparent={true}
            onRequestClose={closeModal}
            animationType="fade"
        >
            <View className="flex flex-row justify-between items-center bg-[#000] p-4">

                <TouchableOpacity style={{
                    backgroundColor: "#000",
                    padding: 8
                }} onPress={closeModal}>
                    <AntDesign name='close' size={28} color={'#fff'} />
                </TouchableOpacity>
                {
                    !smallIsDownload ?
                        <TouchableOpacity style={{
                            backgroundColor: "#000",
                            padding: 8
                        }} onPress={handleDownloadImage}>
                            <AntDesign name='download' size={28} color={'#fff'} />
                        </TouchableOpacity>
                        :
                        <ActivityIndicator size={'small'} color={'#fff'} />
                }

            </View>
            <ReactNativeZoomableView
                contentWidth={300}
                contentHeight={150}
                maxZoom={2}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                visualTouchFeedbackEnabled={false}
                // bindToBorders={true}
                panEnabled={false}
                style={{
                    backgroundColor: "#000"
                }}
            >
                <Image
                    source={{ uri: selectedImage?.fileUrl }}
                    contentFit='contain'
                    style={{
                        height: 500,
                        width: 300
                    }}
                />
            </ReactNativeZoomableView>
        </Modal>
    );
};


export default ImageModal;