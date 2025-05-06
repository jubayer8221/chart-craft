"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TableColumn, TableData } from "./types";
import { resetExport } from "@/redux/slices/exportSlice";

interface TableCardProps {
  title: string;
  data: TableData[];
  columns: TableColumn[];
  variant?:
    | "bordered"
    | "striped"
    | "minimal"
    | "zebra"
    | "shadow"
    | "rounded"
    | "fancy"
    | "darkmode"
    | "lightmode"
    | "hoverable";
}

interface ExportState {
  exportFormat: "pdf" | "image" | null;
  exportRequested: boolean;
  selectedItems: string[];
  selectedExportOptions: string[];
}

const styleVariants = {
  bordered: "border-2 border-gray-700 bg-white",
  striped: "bg-white",
  minimal: "bg-white",
  zebra: "bg-white",
  shadow: "shadow-2xl bg-white",
  rounded: "rounded-2xl border p-6 bg-white shadow-lg",
  fancy:
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-2xl",
  darkmode: "bg-gray-900 text-gray-100 rounded-md shadow",
  lightmode: "bg-gray-100 text-gray-900 rounded-md shadow",
  hoverable: "bg-gray-100 hover:bg-gray-200",
};

export const TableCard: React.FC<TableCardProps> = ({
  title,
  data,
  columns,
  variant = "bordered",
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const exportState = useSelector(
    (state: { export: ExportState }) => state.export
  );
  const theme =
    useSelector(
      (state: { theme?: { mode: "light" | "dark" } }) => state.theme?.mode
    ) || "light";

  // Export logic
  useEffect(() => {
    if (
      exportState.exportRequested &&
      exportState.selectedItems.includes(title)
    ) {
      const exportTable = async () => {
        if (!tableRef.current) {
          console.warn(
            `Table reference for ${title} is not available for export`
          );
          dispatch(resetExport());
          return;
        }

        try {
          document.documentElement.style.colorScheme = "normal";
          const canvas = await html2canvas(tableRef.current, {
            scale: exportState.selectedExportOptions.includes("highResolution")
              ? 2
              : 1,
            backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
            useCORS: true,
            logging: true,
            onclone: (clonedDoc: Document) => {
              const tableElement = clonedDoc.querySelector("table");
              if (tableElement) {
                tableElement.style.backgroundColor =
                  theme === "dark" ? "#1F2937" : "#FFFFFF";
                tableElement.style.color =
                  theme === "dark" ? "#FFFFFF" : "#000000";

                if (variant === "fancy") {
                  tableElement.style.background =
                    "linear-gradient(to right, #6366F1, #A855F7, #EC4899)";
                  tableElement.style.color = "#FFFFFF";
                }
                const rows = tableElement.querySelectorAll("tr");
                rows.forEach((row: HTMLElement, idx: number) => {
                  row.style.backgroundColor =
                    variant === "striped"
                      ? idx % 2 === 0
                        ? "#F3F4F6"
                        : "#D1D5DB"
                      : variant === "zebra"
                      ? idx % 2 === 0
                        ? "#E5E7EB"
                        : "#9CA3AF"
                      : "transparent";
                });
              }
            },
          });

          const imgData = canvas.toDataURL("image/png");

          if (exportState.exportFormat === "image") {
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${title}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (exportState.exportFormat === "pdf") {
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width / 2, canvas.height / 2],
            });
            pdf.addImage(
              imgData,
              "PNG",
              0,
              0,
              canvas.width / 2,
              canvas.height / 2
            );
            pdf.save(`${title}.pdf`);
          }

          dispatch(resetExport());
        } catch (error) {
          console.error(`Export failed for table ${title}:`, error);
          dispatch(resetExport());
        }
      };

      exportTable();
    }
  }, [exportState, theme, dispatch, title, variant]);

  return (
    <motion.div
      layout
      whileDrag={{ scale: 1.02 }}
      drag
      dragElastic={0.2}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      className={`p-4 mb-8 cursor-grab active:cursor-grabbing w-full ${styleVariants[variant]}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-400" />
          <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        </div>
      </div>

      <div
        ref={tableRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
        style={{
          backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
          padding: "16px",
        }}
      >
        <table
          className={`min-w-full text-sm ${
            theme === "dark" ? "text-gray-100" : "text-gray-700"
          }`}
          style={{
            backgroundColor: variant === "fancy" ? "transparent" : undefined,
          }}
        >
          <thead>
            <tr
              className={`${
                variant === "bordered"
                  ? "bg-gray-800 text-white"
                  : variant === "striped"
                  ? "bg-gray-700 text-white"
                  : variant === "minimal"
                  ? "bg-gray-200"
                  : variant === "zebra"
                  ? "bg-gray-700 text-white"
                  : variant === "shadow"
                  ? "bg-gray-800 text-white"
                  : variant === "fancy"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-900 text-white"
              }`}
            >
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="text-left px-2 sm:px-3 py-2 font-semibold whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-all ${
                  variant === "striped"
                    ? idx % 2 === 0
                      ? "bg-gray-100"
                      : "bg-gray-300"
                    : variant === "zebra"
                    ? idx % 2 === 0
                      ? "bg-gray-200"
                      : "bg-gray-400"
                    : variant === "minimal"
                    ? "hover:bg-gray-100"
                    : variant === "fancy"
                    ? "bg-transparent"
                    : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className={`px-2 sm:px-3 py-2 ${
                      variant === "bordered" ||
                      variant === "shadow" ||
                      variant === "rounded"
                        ? "border-b border-gray-300"
                        : ""
                    } whitespace-nowrap`}
                  >
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
