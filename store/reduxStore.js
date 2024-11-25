import { configureStore } from '@reduxjs/toolkit';
import trainingReducer from '../redux/trainingSlice';

const store = configureStore({
    reducer: {
        training: trainingReducer, // Tích hợp slice vào store
    },
});

export default store;
