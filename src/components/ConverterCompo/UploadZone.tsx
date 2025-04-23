// File: components/UploadZone.tsx
"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch } from "@/redux/hooks";
import { handleFileUpload } from "@/redux/slices/convertDataSlice";

export function UploadZone() {
  const dispatch = useAppDispatch();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        dispatch(handleFileUpload(acceptedFiles[0]));
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold py-2">
          Upload your data file to generate visual representations as both a
          table and chart.
        </h2>
        {/* <h1 className="text-2xl font-semibold ">Your Data as Table</h1> */}
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-4 md:p-6 lg:p-8 rounded-xl text-center cursor-pointer hover:bg-white transition-colors duration-200 w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-3">
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-lg md:text-xl font-medium text-gray-600">
              Drop the file here...
            </p>
          ) : (
            <>
              <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600">
                Drag & drop files here
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Supports Excel (.xlsx), PDF (.pdf), and images (.png, .jpg,
                .jpeg)
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                or click to browse files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
