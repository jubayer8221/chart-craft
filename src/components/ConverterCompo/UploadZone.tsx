"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setParsedData,
  setError,
  parseFile,
  clearData,
  setLoading,
} from "@/redux/slices/convertDataSlice";
import { Button } from "../ui/button";
import type { ParsedRow } from "@/types/convertType";

interface DataState {
  data: ParsedRow[];
  error: string | null;
  isLoading: boolean;
  currentRowOffset: number;
  totalRows: number;
}

export function UploadZone() {
  const dispatch = useAppDispatch();
  const { data, error, isLoading, currentRowOffset, totalRows } =
    useAppSelector((state: { data: DataState }) => state.data);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        dispatch(setError("No valid file selected"));
        return;
      }

      const file = acceptedFiles[0];
      setUploadedFile(file); // Store the file for incremental loads
      dispatch(setLoading(true));
      try {
        if (file.type === "application/pdf") {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/parse-pdf", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error("Failed to parse PDF on server");
          }
          const parsedData = await response.json();
          dispatch(
            setParsedData({ data: parsedData, totalRows: parsedData.length })
          );
        } else {
          // Initial parse: load all for small files, 2000 for large
          const result = await parseFile(
            file,
            0,
            totalRows > 2000 ? 2000 : undefined
          );
          dispatch(
            setParsedData({ data: result.data, totalRows: result.totalRows })
          );
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to parse file";
        dispatch(setError(message));
      }
    },
    [dispatch, totalRows]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
      ],
      "text/csv": [".csv"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  // Automatically load subsequent 2000-row batches for large datasets
  useEffect(() => {
    if (
      uploadedFile &&
      !isLoading &&
      data.length > 0 &&
      currentRowOffset < totalRows &&
      totalRows > 2000 &&
      uploadedFile.type !== "application/pdf" &&
      !["image/png", "image/jpeg", "image/jpg"].includes(uploadedFile.type)
    ) {
      const timeout = setTimeout(async () => {
        dispatch(setLoading(true));
        try {
          const result = await parseFile(uploadedFile, currentRowOffset, 2000); // Next 2000 rows
          dispatch(
            setParsedData({ data: result.data, totalRows: result.totalRows })
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to load more data";
          dispatch(setError(message));
        }
      }, 1000); // 1-second delay for UI responsiveness

      return () => clearTimeout(timeout); // Cleanup on unmount
    }
  }, [currentRowOffset, totalRows, uploadedFile, isLoading, data, dispatch]);

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            EXCEL to CHART Converter
            <span className="text-sm block mt-3 text-gray-600 dark:text-gray-400 font-normal">
              Upload your data file to generate visual representations as both a
              table and chart.
            </span>
          </h2>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed h-[270px] rounded-xl text-center cursor-pointer transition-all w-full mx-auto
            ${
              isDragActive
                ? "bg-blue-50 border-blue-400 dark:bg-gray-700 dark:border-white"
                : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-blue-400 dark:hover:border-white"
            } shadow-lg`}
        >
          <input {...getInputProps()} />
          <div className="h-full flex flex-col items-center justify-center p-6 space-y-3">
            <svg
              className={`w-12 h-12 ${
                isDragActive
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600 dark:text-white">
                Drop the file here...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-600 dark:text-white">
                  Drag & drop files here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf), and
                  images (.png, .jpg, .jpeg)
                </p>
                <Button className="hover:bg-blue-800 dark:hover:bg-gray-700">
                  Upload your file
                </Button>
              </>
            )}
          </div>
        </div>
        {/* {isLoading && (
          <p className="text-blue-500 mt-8 text-center">Loading...</p>
        )} */}
        {error && <p className="text-red-500 mt-8 text-center">{error}</p>}
        {data.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => dispatch(clearData())}
              className="bg-red-500 hover:bg-600 text-white"
            >
              Clear Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadZone;
