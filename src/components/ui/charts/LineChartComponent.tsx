import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartComponentProps } from "@/types/types";

export default function LineChartComponent({
  data,
  margin,
  layout,
  xAxisProps,
  yAxisProps,
  valueColumns,
  colors,
  defaultColors,
  showGrid,
  showTooltip,
  showLegend,
}: ChartComponentProps) {
  return (
    <LineChart data={data} margin={margin} layout={layout}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis {...xAxisProps} />
      <YAxis {...yAxisProps} />
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
      {valueColumns.map((key: string) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          name={key}
          stroke={colors[key] || defaultColors[0]}
          activeDot={{ r: 8 }}
        />
      ))}
    </LineChart>
  );
}
