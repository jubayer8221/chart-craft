import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartComponentProps } from "@/types/types";

export default function ScatterChartComponent({
  data,
  margin,
  valueColumns,
  colors,
  defaultColors,
  showGrid,
  showTooltip,
  showLegend,
}: ChartComponentProps) {
  if (valueColumns.length < 2) {
    return (
      <div className="py-6 my-2 text-center text-gray-500">
        Scatter plot requires at least 2 value columns
      </div>
    );
  }

  return (
    <ScatterChart data={data} margin={margin}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={valueColumns[0]} name={valueColumns[0]} type="number" />
      <YAxis dataKey={valueColumns[1]} name={valueColumns[1]} type="number" />
      <ZAxis range={[100, 1000]} />
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
      <Scatter
        name="Data"
        fill={colors[valueColumns[0]] || defaultColors[0]}
        data={data}
      />
    </ScatterChart>
  );
}
