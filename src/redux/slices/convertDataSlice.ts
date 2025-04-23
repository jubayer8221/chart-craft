import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import Tesseract from "tesseract.js";
import { DataState, ParsedRow } from "@/types/convertType";

const initialState: DataState = {
  data: [],
};

// Type guard to check if an item is TextItem
const isTextItem = (item: TextItem | TextMarkedContent): item is TextItem => {
  return "str" in item;
};

export const handleFileUpload = createAsyncThunk<ParsedRow[], File>(
  "data/handleFileUpload",
  async (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(sheet) as ParsedRow[];
    }
    if (extension === 'csv') {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const data: ParsedRow[] = rows.slice(1).map(row => {
        const obj: ParsedRow = {};
        row.forEach((cell, i) => {
          const header = headers[i];
          const val = isNaN(Number(cell)) ? cell.trim() : Number(cell);
          obj[header] = val;
        });
        return obj;
      });
      return data;
    }    
    if (extension === "pdf") {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const textContent: ParsedRow[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content: TextContent = await page.getTextContent();
        const pageText = content.items
          .filter(isTextItem) // Filter only TextItem objects
          .map((item: TextItem) => item.str)
          .join(" ");
        textContent.push({ Page: i, Text: pageText });
      }
      return textContent;
    }
    if (file.type.startsWith("image/")) {
      const text = await Tesseract.recognize(file, "eng");
      return [{ Text: text.data.text }];
    }
    return [];
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleFileUpload.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default dataSlice.reducer;