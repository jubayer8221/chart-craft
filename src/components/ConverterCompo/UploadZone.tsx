// "use client";

// import { useCallback, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   setParsedData,
//   setError,
//   parseFile,
//   clearData,
// } from "@/redux/slices/convertDataSlice";
// import { Button } from "../ui/button";
// import { ParsedRow } from "@/types/convertType";
// import { ChartState } from "@/redux/slices/chartSlice";
// import { ExportState } from "@/redux/slices/exportSlice";
// import { PrintState } from "@/redux/slices/printSlice";
// import { ColorState } from "@/redux/slices/colorSlice";
// import { HeaderState } from "@/redux/slices/headerSlice";
// import { TableState } from "@/redux/slices/recent-orderSlice";

// interface DataState {
//   data: ParsedRow[];
//   searchTerm: string;
//   filtered: ParsedRow[];
//   isLoading: boolean;
//   error: string | null;
//   headerNames: { [key: string]: string };
// }

// interface RootState {
//   charts: ChartState;
//   export: ExportState;
//   chartsTheme: ExportState;
//   recentOrders: TableState;
//   data: DataState;
//   printData: PrintState;
//   colors: ColorState;
//   headers: HeaderState;
//   convertData?: DataState; // Mark as optional if not always present
// }

// export function UploadZone() {
//   const dispatch = useAppDispatch();
//   const parsedData = useAppSelector(
//     (state: RootState) => state.convertData?.data || []
//   );
//   const error = useAppSelector(
//     (state: RootState) => state.convertData?.error || null
//   );

//   useEffect(() => {
//     try {
//       const storedData = sessionStorage.getItem("userData");
//       if (storedData) {
//         const parsedStoredData: ParsedRow[] = JSON.parse(storedData);
//         dispatch(setParsedData(parsedStoredData));
//       }
//     } catch (error) {
//       console.error("Error retrieving data from sessionStorage:", error);
//       dispatch(setError("Failed to load stored data"));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (parsedData && parsedData.length > 0) {
//       try {
//         sessionStorage.setItem("userData", JSON.stringify(parsedData));
//       } catch (error) {
//         console.error("Error storing data in sessionStorage:", error);
//         dispatch(setError("Failed to store data: Storage limit reached"));
//       }
//     }
//   }, [parsedData, dispatch]);

//   const onDrop = useCallback(
//     async (acceptedFiles: File[]) => {
//       if (acceptedFiles.length) {
//         const file = acceptedFiles[0];
//         try {
//           if (file.type === "application/pdf") {
//             // Send PDF to server-side API
//             const formData = new FormData();
//             formData.append("file", file);
//             const response = await fetch("/api/parse-pdf", {
//               method: "POST",
//               body: formData,
//             });
//             if (!response.ok) {
//               throw new Error("Failed to parse PDF on server");
//             }
//             const parsedData = await response.json();
//             dispatch(setParsedData(parsedData));
//           } else {
//             // Handle other files client-side
//             const parsedData = await parseFile(file);
//             dispatch(setParsedData(parsedData));
//           }
//         } catch (error) {
//           const message =
//             error instanceof Error ? error.message : "Failed to parse file";
//           dispatch(setError(message));
//         }
//       }
//     },
//     [dispatch]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
//         ".xlsx",
//         ".xls",
//       ],
//       "text/csv": [".csv"],
//       "image/*": [".png", ".jpg", ".jpeg"],
//     },
//   });

//   return (
//     <div className="bg-gradient-to-b dark:[#312c4a] p-4 md:p-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-semibold dark:text-white text-gray-800">
//             EXCEL to CHART Converter
//             <span className="text-sm block mt-3 dark:text-[#b8b0c5] text-gray-600 font-normal">
//               Upload your data file to generate visual representations as both a
//               table and chart.
//             </span>
//           </h2>
//         </div>

//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed h-[270px] rounded-xl text-center cursor-pointer transition-all duration-200 w-full mx-auto
//             ${
//               isDragActive
//                 ? "dark:bg-[#897c8f] bg-blue-50 border-blue-400 dark:border-white"
//                 : "dark:bg-[#312c4a] bg-white border-gray-300 dark:border-[#685e74] hover:dark:border-white hover:border-blue-400"
//             } shadow-lg`}
//         >
//           <input {...getInputProps()} />
//           <div className="h-full flex flex-col items-center justify-center p-4 md:p-6 space-y-2 md:space-y-3">
//             <svg
//               className={`w-10 h-10 md:w-12 md:h-12 ${
//                 isDragActive
//                   ? "text-blue-600 dark:text-white"
//                   : "text-gray-400 dark:text-[#897c8f]"
//               }`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//               />
//             </svg>

//             {isDragActive ? (
//               <p className="text-lg md:text-xl font-medium text-blue-600 dark:text-white">
//                 Drop the file here...
//               </p>
//             ) : (
//               <>
//                 <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-white">
//                   Drag & drop files here
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-500 dark:text-[#b8b0c5]">
//                   Supports Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf), and
//                   images (.png, .jpg, .jpeg)
//                 </p>
//                 <p className="text-xs sm:text-sm text-blue-900 dark:text-[#b8b0c5] hover:underline">
//                   or click to browse files
//                 </p>
//                 <Button className="hover:bg-blue-800 dark:hover:bg-[#897c8f] transition-colors duration-200">
//                   Upload your file
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//         {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
//         {parsedData.length > 0 && (
//           <div className="text-center mt-4">
//             <Button
//               onClick={() => {
//                 sessionStorage.removeItem("userData");
//                 dispatch(clearData());
//               }}
//               className="bg-red-500 hover:bg-red-600 text-white"
//             >
//               Clear Data
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setParsedData,
  setError,
  parseFile,
  clearData,
} from "@/redux/slices/convertDataSlice";
import { Button } from "../ui/button";
import type { ParsedRow } from "@/types/convertType";

interface DataState {
  data: ParsedRow[];
  error: string | null;
}

export function UploadZone() {
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector(
    (state: { data: DataState }) => state.data
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        dispatch(setError("No valid file selected"));
        return;
      }

      const file = acceptedFiles[0];
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
          dispatch(setParsedData(parsedData));
        } else {
          const parsedData = await parseFile(file);
          dispatch(setParsedData(parsedData));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to parse file";
        dispatch(setError(message));
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
        ".xls",
      ],
      "text/csv": [".csv"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

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
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {data.length > 0 && (
          <div className="text-center mt-4">
            <Button
              onClick={() => dispatch(clearData())}
              className="bg-red-500 hover:bg-red-600 text-white"
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
