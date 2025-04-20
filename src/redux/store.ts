import { configureStore } from '@reduxjs/toolkit';
import chartReducer from './slices/chartSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import exportReducer from './slices/exportSlice';
import chartThemeSlice from './slices/exportSlice';
// import { ChartCardProps } from "@/types/chartTypes";



export const store = configureStore({
  reducer: {
        charts: chartReducer,
        export: exportReducer,
        chartsTheme: chartThemeSlice 

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;