import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { ParsedRow, DataState } from "@/types/convertType";

// Function to convert currency strings to numbers
function parseCurrency(value: string): number | string {
  if (typeof value !== "string") return value;
  // Match currency formats like $100, €50.25, 100 USD, £1,000.50
  const currencyRegex = /^\s*[\$€£¥]?[\d,]+(?:\.[\d]+)?(?:\s*(USD|EUR|GBP|JPY))?\s*$/;
  if (!currencyRegex.test(value)) return value;
    const negative = /^\s*\(.*\)\s*$/.test(value) || value.trim().startsWith("-");

    // Remove currency symbols, spaces, and currency codes
  const cleaned = value
    .replace(/\(([^)]+)\)/, "$1") // remove surrounding parentheses if present
    .replace(/[\$€£¥]/g, "") // remove currency symbols
    .replace(/\b(USD|EUR|GBP|JPY|BDT)\b/gi, "") // remove currency codes
    .replace(/,/g, "") // remove thousand separators
    .trim();
  
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return value;
  return negative ? -Math.abs(parsed) : parsed;
}

const initialState: DataState = {
  data: [],
  searchTerm: "",
  filtered: [],
  isLoading: false,
  error: null,
  headerNames: {},
  tableTitle: "Data Visualization",
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
              let parsedValue: string | number | null;
              if (val == null) {
                parsedValue = null;
              } else if (typeof val === "object" && "text" in val) {
                parsedValue = parseCurrency(String(val.text));
              } else {
                parsedValue = parseCurrency(String(val));
              }
              rowData[header] = parsedValue;
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
          dynamicTyping: false, // Disable PapaParse's automatic number conversion
          skipEmptyLines: true,
          transform: (value: string) => {
            return parseCurrency(value);
          },
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
      state.tableTitle = "Chart";
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
    setTableTitle: (state, action: PayloadAction<string>) => {
      state.tableTitle = action.payload;
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
  setTableTitle,
  setParsedData,
  setError,
} = convertDataSlice.actions;
export default convertDataSlice.reducer;