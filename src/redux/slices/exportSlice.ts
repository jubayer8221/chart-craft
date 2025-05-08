import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExportState {
  exportFormat: "pdf" | "image" | null;
  exportRequested: boolean;
  selectedItems: string[]; // Tracks selected chart items (e.g., IDs of charts)
  selectedExportOptions: string[]; // Tracks export options (e.g., "includeLegend", "highResolution")
}

const initialState: ExportState = {
  exportFormat: null,
  exportRequested: false,
  selectedItems: [],
  selectedExportOptions: [],
};

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    requestExport: (state, action: PayloadAction<"pdf" | "image">) => {
      state.exportFormat = action.payload;
      state.exportRequested = true;
    },
    resetExport: (state) => {
      state.exportFormat = null;
      state.exportRequested = false;
      state.selectedItems = [];
      state.selectedExportOptions = [];
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      state.selectedItems = state.selectedItems.includes(item)
        ? state.selectedItems.filter((i) => i !== item)
        : [...state.selectedItems, item];
    },
    toggleExportOption: (state, action: PayloadAction<string>) => {
      const option = action.payload;
      state.selectedExportOptions = state.selectedExportOptions.includes(option)
        ? state.selectedExportOptions.filter((o) => o !== option)
        : [...state.selectedExportOptions, option];
    },
    clearSelections: (state) => {
      state.selectedItems = [];
      state.selectedExportOptions = [];
    },
  },
});

export const { requestExport, resetExport, toggleItemSelection, toggleExportOption, clearSelections } = exportSlice.actions;
export default exportSlice.reducer;