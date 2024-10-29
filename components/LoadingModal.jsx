import { ActivityIndicator, Modal, Text, View } from 'react-native'

import React from 'react'

const LoadingModal = ({ visible, message }) => {
    return (
        <Modal
            visible={visible}
            style={[{ flex: 1 }]}
            transparent
            statusBarTranslucent>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator color={'#ffffff'} size={48} />
                <Text className="font-psemibold text-lg text-white mt-2">{message}</Text>
            </View>
        </Modal>
    )
}

export default LoadingModal
