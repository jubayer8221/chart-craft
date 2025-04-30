// File: components/UploadZone.tsx
"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch } from "@/redux/hooks";
import { handleFileUpload } from "@/redux/slices/convertDataSlice";
import { Button } from "../ui/button";

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
    <div className=" bg-gradient-to-b dark:[#312c4a] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold dark:text-white text-gray-800">
            EXCEL to CHART Converter
            <span className="text-sm block mt-3 dark:text-[#b8b0c5] text-gray-600 font-normal">
              Upload your data file to generate visual representations as both a
              table and chart.
            </span>
          </h2>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed h-[270px] rounded-xl text-center cursor-pointer transition-all duration-200 w-full mx-auto
            ${
              isDragActive
                ? "dark:bg-[#897c8f] bg-blue-50 border-blue-400 dark:border-white"
                : "dark:bg-[#312c4a] bg-white border-gray-300 dark:border-[#685e74] hover:dark:border-white hover:border-blue-400"
            } shadow-lg`}
        >
          <input {...getInputProps()} />
          <div className="h-full flex flex-col items-center justify-center p-4 md:p-6 space-y-2 md:space-y-3">
            <svg
              className={`w-10 h-10 md:w-12 md:h-12 ${
                isDragActive
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-400 dark:text-[#897c8f]"
              }`}
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
              <p className="text-lg md:text-xl font-medium text-blue-600 dark:text-white">
                Drop the file here...
              </p>
            ) : (
              <>
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-white">
                  Drag & drop files here
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#b8b0c5]">
                  Supports Excel (.xlsx), PDF (.pdf), and images (.png, .jpg,
                  .jpeg)
                </p>
                <p className="text-xs sm:text-sm text-blue-900 dark:text-[#b8b0c5] hover:underline">
                  or click to browse files
                </p>
                <Button className="hover:bg-blue-800 dark:hover:bg-[#897c8f] transition-colors duration-200">
                  Upload your file
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
