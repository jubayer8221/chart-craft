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


export const store = configureStore({
  reducer: {
    charts: chartReducer,
    export: exportReducer,
    chartsTheme: exportReducer, // Fixed duplicate import
    recentOrders: recentOrderReducer,
    data: dataReducer,
    printData: printSlice,
    colors: colorSlice,
    headers: headerReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;