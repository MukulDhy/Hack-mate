// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import webSocketReducer from './slices/websocketSlice'
import { initWebSocketService } from '../service/websocketService';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    websocket: webSocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST','websocket/presenceUpdate', 'websocket/typingIndicator'],
         ignoredPaths: ['websocket.onlineUsers', 'websocket.typingIndicators'],
      },
    }),
});


export const webSocketService = initWebSocketService(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;