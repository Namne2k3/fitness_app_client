import React, { useEffect, useState } from 'react'
import { Modal, Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';


const LoadingCreatingModal = ({ visible, onClose, message = "Đang tạo kế hoạch tập luyện cho bạn" }) => {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (visible) {
            setProgress(0); // Reset progress
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        if (onClose) onClose();
                        return 100;
                    }
                    return prev + 2; // Increment progress by 2%
                });
            }, 100); // Updates every 100ms
        }

        return () => clearInterval(interval);
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        backgroundColor: '#FFFFFF',
                        padding: 20,
                        borderRadius: 16,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                    <CircularProgress
                        value={progress}
                        maxValue={100}
                        radius={60}
                        activeStrokeWidth={10}
                        inActiveStrokeWidth={10}
                        inActiveStrokeColor={'#e0e0e0'}
                        activeStrokeColor={'#3749db'}
                        textColor={'#3749db'}
                        valueSuffix={'%'}
                    />
                    <Text
                        style={{
                            marginTop: 16,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#3749db',
                            textAlign: 'center',
                        }}>
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default LoadingCreatingModal