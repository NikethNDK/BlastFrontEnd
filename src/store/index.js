import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        notifications: notificationReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
