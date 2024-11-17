import { io } from 'socket.io-client'

// const socket = io.connect('https://w2fw01lr-3000.asse.devtunnels.ms')
const socket = io('https://w2fw01lr-3000.asse.devtunnels.ms', {
    transports: ['websocket'],
    withCredentials: true,
});

socket.on('connect', () => {
    console.log("Connected to server with socket ID: ", socket.id);
})

socket.on('disconnect', (reason) => {
    console.log("Disconnected from server", reason);
})

export default socket;

// tạo một kết nối realtime đến server được host tại url trên