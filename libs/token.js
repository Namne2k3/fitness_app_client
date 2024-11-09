import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm lấy token
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token !== null) {
            // Token đã được lưu trước đó
            // console.log('Token đã lấy:', token);
            return token;
        } else {
            console.log('Không có token nào được lưu');
        }
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('jwt_token');
        console.log('Token đã được xóa');
    } catch (error) {
        console.error('Lỗi khi xóa token:', error);
    }
};

export {
    getToken,
    removeToken
}