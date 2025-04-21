import { Bar, Pie, Line } from "react-chartjs-2";
import { ChartCardProps } from "@/types/chartTypes";

const ChartRenderer = ({
  type,
  data,
}: {
  type: ChartCardProps["type"];
  data: ChartCardProps["data"];
}) => {
  if (type === "bar") return <Bar data={data} />;
  if (type === "line") return <Line data={data} />;
  if (type === "pie") return <Pie data={data} />;
  return null;
};

export default ChartRenderer;
