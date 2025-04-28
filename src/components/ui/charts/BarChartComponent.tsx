import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartComponentProps } from "@/types/types";

export default function BarChartComponent({
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
    <BarChart data={data} margin={margin} layout={layout}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      {layout === "vertical" ? (
        <>
          <YAxis {...xAxisProps} />
          <XAxis {...yAxisProps} />
        </>
      ) : (
        <>
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
        </>
      )}
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
      {valueColumns.map((key: string) => (
        <Bar
          key={key}
          dataKey={key}
          name={key}
          fill={colors[key] || defaultColors[0]}
          stackId={stacked ? "stack" : undefined}
        />
      ))}
    </BarChart>
  );
}
