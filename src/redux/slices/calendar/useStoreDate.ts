import { getMonth } from '@/lib/getTime';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

// Define the state interface
interface DateState {
  userSelectedDate: string; // Save as ISO string
  twoDMonthArray: string[][]; // Store as ISO strings
  selectedMonthIndex: number;
}

// Initial state
const initialState: DateState = {
  userSelectedDate: dayjs().toISOString(),
  twoDMonthArray: getMonth().map((week) => week.map((day) => day.toISOString())), // Convert Dayjs to ISO strings
  selectedMonthIndex: dayjs().month(),
};

// Create the slice
const useStoreDate = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.userSelectedDate = action.payload.toISOString();
    },
    setMonth: (state, action: PayloadAction<number>) => {
      state.twoDMonthArray = getMonth(action.payload).map((week) =>
        week.map((day) => day.toISOString())
      ); // Convert Dayjs to ISO strings
      state.selectedMonthIndex = action.payload;
    },
  },
});

// Export actions
export const { setDate, setMonth } = useStoreDate.actions;

// Export reducer
export default useStoreDate.reducer;

// Persistence configuration
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'date_data',
  storage,
};

export const persistedDateReducer = persistReducer(persistConfig, useStoreDate.reducer);