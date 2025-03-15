import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

import {
    TypedUseSelectorHook,
    useDispatch as reduxUseDispatch,
    useSelector as reduxUseSelector,
} from 'react-redux';

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({ reducer: rootReducer })

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;

export default store;