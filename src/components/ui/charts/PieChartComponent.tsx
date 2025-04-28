import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PieChartComponentProps } from "@/types/types";

export default function PieChartComponent({
  data,
  margin,
  pieData,
  valueColumns,
  colors,
  defaultColors,
  showTooltip,
  showLegend,
}: PieChartComponentProps) {
  if (!pieData.length) {
    return (
      <div className="py-6 my-2 text-center text-gray-500">
        No valid data available for Pie Chart
      </div>
    );
  }

  return (
    <PieChart data={data} margin={margin}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        label
      >
        {pieData.map((_, index: number) => (
          <Cell
            key={`cell-${index}`}
            fill={
              colors[valueColumns[0]] ||
              defaultColors[index % defaultColors.length]
            }
          />
        ))}
      </Pie>
      {showTooltip && <Tooltip />}
      {showLegend && <Legend />}
    </PieChart>
  );
}
