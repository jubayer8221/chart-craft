import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { ParsedRow, DataState } from "@/types/convertType";

const initialState: DataState = {
  data: [],
  searchTerm: "",
  filtered: [],
  isLoading: false,
  error: null,
  headerNames: {},
};

export async function parseFile(file: File): Promise<ParsedRow[]> {
  try {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    if (
      (extension === "xlsx" || extension === "xls") &&
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      const jsonData: ParsedRow[] = [];
      let headers: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          headers = (Array.isArray(row.values) ? row.values.slice(1) : []).map(
            (val: ExcelJS.CellValue, idx: number) =>
              val == null ? `Column${idx + 1}` : String(val)
          );
        } else {
          const rowData: ParsedRow = {};
          (Array.isArray(row.values) ? row.values.slice(1) : []).forEach(
            (val: ExcelJS.CellValue, index: number) => {
              const header = headers[index] || `Column${index + 1}`;
              rowData[header] =
                val == null
                  ? null
                  : typeof val === "object" && "text" in val
                  ? String(val.text)
                  : String(val);
            }
          );
          jsonData.push(rowData);
        }
      });

      return jsonData;
    }

    if (extension === "csv" && mimeType === "text/csv") {
      return new Promise<ParsedRow[]>((resolve, reject) => {
        Papa.parse<ParsedRow>(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<ParsedRow>) => resolve(results.data),
          error: (error: Error) => reject(error),
        });
      });
    }

    throw new Error(`Unsupported file type: ${extension}`);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

const convertDataSlice = createSlice({
  name: "convertData",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      if (!action.payload) {
        state.filtered = state.data;
        return;
      }
      const searchLower = action.payload.toLowerCase();
      state.filtered = state.data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    },
    clearData: (state) => {
      state.data = [];
      state.filtered = [];
      state.searchTerm = "";
      state.error = null;
      state.isLoading = false;
      state.headerNames = {};
    },
    setHeaderName: (
      state,
      action: PayloadAction<{ key: string; name: string }>
    ) => {
      state.headerNames[action.payload.key] = action.payload.name;
    },
    initializeHeaderNames: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.headerNames = action.payload;
    },
    setParsedData: (state, action: PayloadAction<ParsedRow[]>) => {
      state.data = action.payload;
      state.filtered = action.payload;
      state.searchTerm = "";
      state.isLoading = false;
      state.error = null;
      if (action.payload.length > 0) {
        state.headerNames = Object.keys(action.payload[0]).reduce(
          (acc, key) => ({ ...acc, [key]: key }),
          {}
        );
      } else {
        state.headerNames = {};
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setSearchTerm,
  clearData,
  setHeaderName,
  initializeHeaderNames,
  setParsedData,
  setError,
} = convertDataSlice.actions;
export default convertDataSlice.reducer;