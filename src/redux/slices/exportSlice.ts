import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExportState {
  selectedItems: string[];
  selectedExportOptions: string[];
}

const initialState: ExportState = {
  selectedItems: [],
  selectedExportOptions: ["csv"],
};

export const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (state.selectedItems.includes(itemId)) {
        state.selectedItems = state.selectedItems.filter(id => id !== itemId);
      } else {
        state.selectedItems.push(itemId);
      }
    },
    toggleExportOption: (state, action: PayloadAction<string>) => {
      const option = action.payload;
      if (state.selectedExportOptions.includes(option)) {
        state.selectedExportOptions = state.selectedExportOptions.filter(
          opt => opt !== option
        );
      } else {
        state.selectedExportOptions.push(option);
      }
    },
    clearSelections: state => {
      state.selectedItems = [];
    },
  },
});

export const { toggleItemSelection, toggleExportOption, clearSelections } =
  exportSlice.actions;
export default exportSlice.reducer;