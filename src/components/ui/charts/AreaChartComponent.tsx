import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartComponentProps } from "@/types/types";

export default function AreaChartComponent({
  data,
  margin,
  layout,
  xAxisProps,
  yAxisProps,
  valueColumns,
  colors,
  defaultColors,
  stacked,
  showGrid,
  showTooltip,
  showLegend,
}: ChartComponentProps) {
  return (
    <AreaChart data={data} margin={margin} layout={layout}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis {...xAxisProps} />
      <YAxis {...yAxisProps} />
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
      {valueColumns.map((key: string) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          name={key}
          stroke={colors[key] || defaultColors[0]}
          fill={colors[key] || defaultColors[0]}
          fillOpacity={0.4}
          stackId={stacked ? "stack" : undefined}
        />
      ))}
    </AreaChart>
  );
}
