import { configureStore } from '@reduxjs/toolkit';
import chartReducer from './slices/chartSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import exportReducer from './slices/exportSlice';



export const store = configureStore({
  reducer: {
        charts: chartReducer,
        export: exportReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;