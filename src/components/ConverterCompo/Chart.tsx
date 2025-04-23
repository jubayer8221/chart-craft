"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ParsedRow } from "@/types/convertType";

export function Chart({ data }: { data: ParsedRow[] }) {
  const numericKey = Object.keys(data[0] || {}).find(
    (key) => typeof data[0][key] === "number"
  );
  const labelKey = Object.keys(data[0] || {}).find((key) => key !== numericKey);
  if (!numericKey || !labelKey) return null;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={numericKey} fill="#0A3A66" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
