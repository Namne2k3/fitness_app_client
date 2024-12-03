import { io } from 'socket.io-client'
import { scheduleNotificationAsync } from 'expo-notifications';
// const socket = io.connect('https://w2fw01lr-3000.asse.devtunnels.ms')
const socket = io('https://w2fw01lr-3000.asse.devtunnels.ms', {
    transports: ['websocket'],
    withCredentials: true,
});

const handleNotify = async (message) => {
    console.log("Check mess >>> ", message);

    await scheduleNotificationAsync({
        content: {
            title: message.content,
            body: message?.senderId?.username
        },
        trigger: {
            seconds: 1
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

    handleNotify(message)
});

export default socket;

// tạo một kết nối realtime đến server được host tại url trên