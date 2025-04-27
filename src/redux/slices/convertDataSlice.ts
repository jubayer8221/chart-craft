"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import Tesseract from "tesseract.js";
import { DataState, ParsedRow } from "@/types/convertType";
import Papa from "papaparse";

const initialState: DataState & { searchTerm: string; filtered: ParsedRow[] } = {
  data: [],
  searchTerm: "",
  filtered: [],
};

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

    if (extension === "csv") {
      return new Promise<ParsedRow[]>((resolve, reject) => {
        const results: ParsedRow[] = [];
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          chunk: (chunk) => {
            results.push(...(chunk.data as ParsedRow[]));
          },
          complete: () => resolve(results),
          error: (err) => reject(err),
        });
      });
    }

    if (extension === "pdf") {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const textContent: ParsedRow[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content: TextContent = await page.getTextContent();
        const pageText = content.items
          .filter(isTextItem)
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
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      const searchLower = action.payload.toLowerCase();
      state.filtered = state.data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleFileUpload.fulfilled, (state, action) => {
      state.data = action.payload;
      state.filtered = action.payload;
    });
  },
});

export const { setSearchTerm } = dataSlice.actions;
export default dataSlice.reducer;
