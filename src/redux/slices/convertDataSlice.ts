import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { ParsedRow, DataState } from "@/types/convertType";

// Function to convert currency strings to numbers
function parseCurrency(value: string): number | string {
  if (typeof value !== "string") return value;

  // Match currency formats like $100, €50.25, or plain numbers like -0.0255, 0.2455
  const currencyRegex = /^\s*[-]?[\$€£¥]?[\d,]+(?:\.[\d]+)?(?:\s*(USD|EUR|GBP|JPY))?\s*$/;
  const numberRegex = /^\s*[-]?\d*\.?\d+\s*$/; // Match plain numbers like -0.0255, 0.2455

  if (numberRegex.test(value)) {
    const parsed = parseFloat(value.trim());
    return isNaN(parsed) ? value : parsed; // Return as number if valid
  }

  if (!currencyRegex.test(value)) return value;

  const negative = /^\s*\(.*\)\s*$/.test(value) || value.trim().startsWith("-");

  // Remove currency symbols, spaces, and currency codes
  const cleaned = value
    .replace(/\(([^)]+)\)/, "$1") // Remove surrounding parentheses
    .replace(/[\$€£¥]/g, "") // Remove currency symbols
    .replace(/\b(USD|EUR|GBP|JPY|BDT)\b/gi, "") // Remove currency codes
    .replace(/,/g, "") // Remove thousand separators
    .trim();

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return value;
  return negative ? -Math.abs(parsed) : parsed;
}

interface ParseFileResult {
  data: ParsedRow[];
  totalRows: number;
}

const initialState: DataState = {
  data: [],
  searchTerm: "",
  filtered: [],
  isLoading: false,
  error: null,
  headerNames: {},
  tableTitle: "Data Visualization",
  currentRowOffset: 0, // Track rows loaded for large datasets
  totalRows: 0, // Total rows in the file
  loadCount: 0,
};

export async function parseFile(
  file: File,
  startRow: number = 0,
  maxRows?: number
): Promise<ParseFileResult> {
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
      const totalRows = worksheet.rowCount - 1; // Exclude header row

      let rowCount = 0;
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          headers = (Array.isArray(row.values) ? row.values.slice(1) : []).map(
            (val: ExcelJS.CellValue, idx: number) =>
              val == null ? `Column${idx + 1}` : String(val)
          );
          return; // Skip header row
        }

        if (rowNumber - 1 < startRow + 1) return; // Skip rows before startRow
        if (maxRows !== undefined && rowCount >= maxRows) return; // Stop after maxRows

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
        rowCount++;
      });

      return { data: jsonData, totalRows };
    }

    if (extension === "csv" && mimeType === "text/csv") {
      return new Promise<ParseFileResult>((resolve, reject) => {
        const jsonData: ParsedRow[] = [];
        let rowCount = 0;
        let totalRows = 0;

        Papa.parse<ParsedRow>(file, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          transform: (value: string) => parseCurrency(value),
          step: (results: Papa.ParseStepResult<ParsedRow>, parser: Papa.Parser) => {
            totalRows++;
            if (totalRows - 1 < startRow) return; // Skip rows before startRow
            if (maxRows !== undefined && rowCount >= maxRows) {
              parser.abort(); // Stop parsing after maxRows
            }
            jsonData.push(results.data);
            rowCount++;
          },
          complete: () => resolve({ data: jsonData, totalRows: totalRows - 1 }), // Exclude header row
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
      state.currentRowOffset = 0;
      state.totalRows = 0;
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
    setParsedData: (
      state,
      action: PayloadAction<{ data: ParsedRow[]; totalRows: number }>
    ) => {
      if (state.currentRowOffset === 0) {
        state.data = action.payload.data; // Replace data for initial load
      } else {
        state.data = [...state.data, ...action.payload.data]; // Append for subsequent loads
      }
      state.filtered = state.data;
      state.searchTerm = "";
      state.isLoading = false;
      state.error = null;
      state.currentRowOffset += action.payload.data.length;
      state.totalRows = action.payload.totalRows;
      if (action.payload.data.length > 0 && Object.keys(state.headerNames).length === 0) {
        state.headerNames = Object.keys(action.payload.data[0]).reduce(
          (acc, key) => ({ ...acc, [key]: key }),
          {}
        );
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
  setLoading,
} = convertDataSlice.actions;
export default convertDataSlice.reducer;