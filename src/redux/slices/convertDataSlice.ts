import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { ParsedRow, DataState } from "@/types/convertType";

// Constants for file size and row limits
const MAX_FILE_SIZE_MB = 150; // 150MB
const MAX_ROWS_CLIENT = 10000000; // 10M rows
const PARTITION_SIZE = 2000; // Rows per partition

// Function to convert currency strings to numbers
function parseCurrency(value: string): number | string {
  if (typeof value !== "string") return value;

  const currencyRegex = /^\s*[-]?[\$€£¥]?[\d,]+(?:\.[\d]+)?(?:\s*(USD|EUR|GBP|JPY))?\s*$/;
  const numberRegex = /^\s*[-]?\d*\.?\d+\s*$/;

  if (numberRegex.test(value)) {
    const parsed = parseFloat(value.trim());
    return isNaN(parsed) ? value : parsed;
  }

  if (!currencyRegex.test(value)) return value;

  const negative = /^\s*\(.*\)\s*$/.test(value) || value.trim().startsWith("-");
  const cleaned = value
    .replace(/\(([^)]+)\)/, "$1")
    .replace(/[\$€£¥]/g, "")
    .replace(/\b(USD|EUR|GBP|JPY|BDT)\b/gi, "")
    .replace(/,/g, "")
    .trim();

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return value;
  return negative ? -Math.abs(parsed) : parsed;
}

interface ParseFileResult {
  data: ParsedRow[];
  totalRows: number;
}

export async function parseFile(
  file: File,
  partitionIndex: number,
  partitionSize: number = PARTITION_SIZE
): Promise<ParseFileResult> {
  try {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(
        `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;
    const startRow = partitionIndex * partitionSize;
    const maxRows = partitionSize;

    if (
      (extension === "xlsx" || extension === "xls") &&
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      const totalRows = worksheet.rowCount - 1; // Exclude header row

      if (totalRows > MAX_ROWS_CLIENT) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("startRow", startRow.toString());
        formData.append("maxRows", maxRows.toString());
        const response = await fetch("/api/parse-excel", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to parse Excel file on server");
        }
        const result = await response.json();
        return { data: result.data, totalRows: result.totalRows };
      }

      const jsonData: ParsedRow[] = [];
      let headers: string[] = [];
      let rowCount = 0;

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          headers = (Array.isArray(row.values) ? row.values.slice(1) : []).map(
            (val: ExcelJS.CellValue, idx: number) =>
              val == null ? `Column${idx + 1}` : String(val)
          );
          return;
        }

        if (rowNumber - 1 < startRow + 1) return;
        if (rowCount >= maxRows) return;

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
            if (totalRows > MAX_ROWS_CLIENT && partitionIndex === 0) {
              parser.abort();
              reject(
                new Error(
                  `File exceeds maximum row limit of ${MAX_ROWS_CLIENT}.`
                )
              );
              return;
            }
            if (totalRows - 1 < startRow) return;
            if (rowCount >= maxRows) {
              parser.abort();
            }
            jsonData.push(results.data);
            rowCount++;
          },
          complete: () => resolve({ data: jsonData, totalRows: totalRows - 1 }),
          error: (error: Error) => reject(error),
        });
      });
    }

    throw new Error(`Unsupported file type: ${extension}`);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Unknown error during file parsing");
  }
}

const initialState: DataState = {
  data: [],
  searchTerm: "",
  filtered: [],
  isLoading: false,
  error: null,
  headerNames: {},
  tableTitle: "Data Visualization",
  currentRowOffset: 0,
  totalRows: 0,
  partitions: 0,
  loadedPartitions: 0,
};

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
      state.tableTitle = "Data Visualization";
      state.currentRowOffset = 0;
      state.totalRows = 0;
      state.partitions = 0;
      state.loadedPartitions = 0;
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
      action: PayloadAction<{
        data: ParsedRow[];
        totalRows: number;
        partitionIndex: number;
      }>
    ) => {
      if (action.payload.partitionIndex === 0) {
        state.data = action.payload.data; // Replace data for first partition
        state.partitions = Math.ceil(
          action.payload.totalRows / PARTITION_SIZE
        );
        state.loadedPartitions = 1;
      } else {
        state.data = [...state.data, ...action.payload.data]; // Append for subsequent partitions
        state.loadedPartitions += 1;
      }
      state.filtered = state.data;
      state.searchTerm = "";
      state.isLoading = false;
      state.error = null;
      state.currentRowOffset += action.payload.data.length;
      state.totalRows = action.payload.totalRows;
      if (
        action.payload.data.length > 0 &&
        Object.keys(state.headerNames).length === 0
      ) {
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