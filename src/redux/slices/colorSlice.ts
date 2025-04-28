import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ColorState {
  colors: Record<string, string>;
}

const initialState: ColorState = {
  colors: {},
};

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<{ column: string; color: string }>) => {
      state.colors[action.payload.column] = action.payload.color;
    },
    setColors: (state, action: PayloadAction<Record<string, string>>) => {
      state.colors = action.payload;
    },
    resetColors: (state) => {
      state.colors = {};
    },
  },
});

export const { setColor, setColors, resetColors } = colorSlice.actions;
export default colorSlice.reducer;