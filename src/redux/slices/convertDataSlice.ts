import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import Tesseract from "tesseract.js";
import { DataState, ParsedRow } from "@/types/convertType";
import Papa from "papaparse";

GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV === "production"
    ? "/pdf.worker.min.js"
    : "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const initialState: DataState = {
  data: [],
  searchTerm: "",
  filtered: [],
  isLoading: false,
  error: null,
};

const isTextItem = (item: unknown): item is TextItem => {
  return typeof item === "object" && item !== null && "str" in item;
};

export const handleFileUpload = createAsyncThunk<
  ParsedRow[],
  File,
  { rejectValue: string }
>("data/handleFileUpload", async (file: File, { rejectWithValue }) => {
  try {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    // Handle Excel files
    if (
      (extension === "xlsx" || extension === "xls") &&
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(sheet);
      return jsonData;
    }

    // Handle CSV files
    if (extension === "csv" && mimeType === "text/csv") {
      return new Promise<ParsedRow[]>((resolve, reject) => {
        Papa.parse<ParsedRow>(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<ParsedRow>) => {
            resolve(results.data);
          },
          error: (error: Error) => {
            reject(rejectWithValue(error.message));
          },
        });
      });
    }

    // Handle PDF files
    if (extension === "pdf" && mimeType === "application/pdf") {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocument(data).promise;
      const textContent: ParsedRow[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter(isTextItem)
          .map((item) => item.str)
          .join(" ");
        textContent.push({ Page: i, Text: pageText });
      }

      return textContent;
    }

    // Handle image files
    if (
      mimeType.startsWith("image/") &&
      ["image/jpeg", "image/png", "image/gif"].includes(mimeType)
    ) {
      const result = await Tesseract.recognize(file, "eng");
      return [{ Text: result.data.text }];
    }

    return rejectWithValue(
      `Unsupported file type: ${extension} (MIME: ${mimeType})`
    );
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

const dataSlice = createSlice({
  name: "data",
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleFileUpload.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        handleFileUpload.fulfilled,
        (state, action: PayloadAction<ParsedRow[]>) => {
          state.isLoading = false;
          state.data = action.payload;
          state.filtered = action.payload;
          state.searchTerm = "";
        }
      )
      .addCase(handleFileUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to process file";
      });
  },
});

export const { setSearchTerm, clearData } = dataSlice.actions;
export default dataSlice.reducer;