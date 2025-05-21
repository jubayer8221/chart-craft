
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import dayjs, { Dayjs } from 'dayjs'

interface ViewState {
  selectedView: string
}

// interface DateStoreType {
//   userSelectedData: Dayjs;
//   setDate: (value: Dayjs) => void;
//   twoDMonthArray: dayjs.Dayjs[][];
//   selectedMonthIndex: number;
//   setMonth: (index: number) => void;
// }

const initialState: ViewState = {
  selectedView: 'Month',
}

const useViewStore = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setSelectedView: (state, action: PayloadAction<string>) => {
      state.selectedView = action.payload
    },
  },
});




export const { setSelectedView } = useViewStore.actions
export default useViewStore.reducer

