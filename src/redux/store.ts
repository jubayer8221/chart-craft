"use client";

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import chartReducer from './slices/chartSlice';
import exportReducer from './slices/exportSlice';
import recentOrderReducer from "./slices/recent-orderSlice";
import dataReducer from "./slices/convertDataSlice";
import printSlice from "./slices/printSlice";
import colorSlice from "./slices/colorSlice";
import headerReducer from "./slices/headerSlice";
import viewReducer from './slices/viewStore';
import { persistedDateReducer } from './slices/calendar/useStoreDate';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const persistConfig = {
  key: 'calendar_view',
  storage,
  whitelist: ['view', 'date'], // Added 'date' to persist the date slice
};

const persistedReducer = persistReducer(persistConfig, viewReducer );

export const store = configureStore({
  reducer: {
    charts: chartReducer,
    export: exportReducer,
    chartsTheme: exportReducer, // Kept as is (duplicate intentional)
    recentOrders: recentOrderReducer,
    data: dataReducer,
    printData: printSlice,
    colors: colorSlice,
    headers: headerReducer,
    view: persistedReducer,
    date: persistedDateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;