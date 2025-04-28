// This part only work for File: Chart.tsx

import { ParsedRow, ProcessedData } from "@/types/types";

export function processData(data: ParsedRow[]): ProcessedData {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { columns: [], processedData: [], numericColumns: [], nonNumericColumns: [] };
  }

  const columns = Array.from(
    new Set(data.flatMap((row: ParsedRow) => Object.keys(row)))
  ).filter((col: string) => col);

  const processedData = data.map((row: ParsedRow) => {
    const newRow: ParsedRow = {};
    columns.forEach((col: string) => {
      if (row[col] !== null && row[col] !== undefined) {
        const numValue = Number(row[col]);
        newRow[col] = isNaN(numValue) ? String(row[col]) : numValue;
      } else {
        newRow[col] = null;
      }
    });
    return newRow;
  });

  const numericColumns = columns.filter((col: string) =>
    processedData.some(
      (row: ParsedRow) =>
        row[col] !== null &&
        row[col] !== undefined &&
        typeof row[col] === "number"
    )
  );

  const nonNumericColumns = columns.filter((col: string) => !numericColumns.includes(col));

  return { columns, processedData, numericColumns, nonNumericColumns };
}