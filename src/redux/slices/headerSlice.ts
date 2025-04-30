import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderState {
  headerNames: { [key: string]: string };
}

const initialState: HeaderState = {
  headerNames: {},
};

const headerSlice = createSlice({
  name: "headers",
  initialState,
  reducers: {
    setHeaderName: (
      state,
      action: PayloadAction<{ key: string; name: string }>
    ) => {
      state.headerNames[action.payload.key] = action.payload.name;
    },
    initializeHeaderNames: (
      state,
      action: PayloadAction<{ [key: string]: string }>
    ) => {
      state.headerNames = action.payload;
    },
  },
});

export const { setHeaderName, initializeHeaderNames } = headerSlice.actions;
export default headerSlice.reducer;