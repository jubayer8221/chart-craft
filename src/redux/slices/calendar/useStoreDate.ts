import { getMonth } from '@/lib/getTime';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

// Define the state interface
interface DateState {
  userSelectedDate: Dayjs;
  twoDMonthArray: Dayjs[][]; // Adjust type based on getMonth return type
  selectedMonthIndex: number;
}

// Initial state
const initialState: DateState = {
  userSelectedDate: dayjs(),
  twoDMonthArray: getMonth(),
  selectedMonthIndex: dayjs().month(),
};

// Create the slice
const useStoreDate = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.userSelectedDate = action.payload;
    },
    setMonth: (state, action: PayloadAction<number>) => {
      state.twoDMonthArray = getMonth(action.payload);
      state.selectedMonthIndex = action.payload;
    },
  },
});

// Export actions
export const { setDate, setMonth } = useStoreDate.actions;

// Export reducer
export default useStoreDate.reducer

// Persistence configuration (to be used in store setup)
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage for web)

const persistConfig = {
  key: 'date_data',
  storage,
  // Skip hydration is not directly supported in redux-persist; 
  // manage initialization in the app if needed
};

export const persistedDateReducer = persistReducer(persistConfig, useStoreDate.reducer);