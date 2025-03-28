import { io } from 'socket.io-client'
import { scheduleNotificationAsync } from 'expo-notifications';

const socket = io(process.env.EXPO_PUBLIC_URL_SERVER, {
    transports: ['websocket'],
    withCredentials: true,
});

const handleNotify = async (message) => {

    await scheduleNotificationAsync({
        content: {
            title: message?.sender?.username,
            body: message?.content
        },
        trigger: {
            seconds: 2
        }
    });
}

socket.on('connect', () => {
    console.log("Connected to server with socket ID: ", socket.id);
})

socket.on('disconnect', (reason) => {
    console.log("Disconnected from server", reason);
})

socket.on("newMessage", async (message) => {
    console.log("Nhan message from socket");

    // handleNotify(message)
});

export default socket;

// tạo một kết nối realtime đến server được host tại url trên