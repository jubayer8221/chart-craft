"use client";

// import AreaChartCompo from "@/app/page/[id]/page";
import AreaChartCompo from "../../areachart/[id]/page.jsx";
import data from "../../../../data/data";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChildrenChart = () => {
  const params = useParams();
  const id = params.id;
  const [chartData, setChartData] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  console.log("found", chartData);

  const findItemById = (items, id) => {
    // console.log("all data",items)
    for (let item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Function to collect chart data
  const collectedChartData = (item) => {
    // console.log("===========", item);
    const chartData = [];
    // console.log("ChartData-----", chartData);
    const collect = (node) => {
      console.log("collect: ", node);
      chartData.push({
        name: node.name,
        borr: node.borr,
        savings: node.savings,
        savingsRatio: parseFloat(node.savingsRatio), // Convert "39%" to 39
      });
      // chartData.push({
      //   if (node.children) {
      //     node.children.forEach((chil) => collect(chil));
      //   }
    };
    collect(item);
    return chartData;
  };

  useEffect(() => {
    if (id) {
      const item = findItemById(data, id);
      if (item) {
        const formattedData = collectedChartData(item);
        setChartData(formattedData);
        setChartData2(item);
      }
    }
  }, [id]);

  const [chartConfig, setChartConfig] = useState({
    stacked: false,
    horizontal: false,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
  });

  const commonProps = {
    data: chartData2,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
    layout: chartConfig.horizontal ? "vertical" : "horizontal",
    animationDuration: 500,
    animationEasing: "ease-in-out",
  };

  const processedData = chartData2
    ? [
        {
          id: chartData2.id,
          name: chartData2.name,
          borr: Number(chartData2.borr) || 0,
          os: Number(chartData2.os) || 0,
          avgos: Number(chartData2.avgos) || 0,
          otr: parseFloat(chartData2.otr),
          disbursement: Number(chartData2.disbursement) || 0,
          savings: Number(chartData2.savings) || 0,
          savingsRatio: parseFloat(chartData2.savingsRatio),
          totalcollection: Number(chartData2.totalcollection) || 0,
          serviceCharge: Number(chartData2.serviceCharge) || 0,
          savingscollection: Number(chartData2.savingscollection) || 0,
          overdue: Number(chartData2.overdue) || 0,
          cashandbank: Number(chartData2.cashandbank) || 0,
          savingsRatio: Number(chartData2.savingsRatio) || 0,
          srratio: parseFloat(chartData2.srratio) || 0,
          savingsrtn: Number(chartData2.savingsrtn) || 0,
        },
      ]
    : [];

  // For single row value to chart
  const valueColumns = [
    // { id: "borr", name: "Borr/Br", color: "#ff00ff" },
    { id: "savings", name: "Savings", color: "#82ca9d" },
    { id: "savingsRatio", name: "Savings Ratio", color: "#ff00ff" },
    { id: "os", name: "OS", color: "#2E8B57" },
    { id: "avgos", name: "AvgOS", color: "#00ffff" },
    { id: "otr", name: "OTR", color: "#ff7f50" },
    { id: "totalcollection", name: "Total Collection", color: "#8884d8" },
    { id: "serviceCharge", name: "Service Charge", color: "#ffc658" },
    { id: "savingscollection", name: "Savings Collection", color: "#ff7300" },
    { id: "savingsrtn", name: "Savings Return", color: "#6495ed" },
    { id: "srratio", name: "SR Ratio", color: "#dc143c" },
    { id: "disbursement", name: "Disbursement", color: "#38A3A5" },
    { id: "cashandbank", name: "Cash&Bank", color: "#00ff00" },
    { id: "overdue", name: "Overdue", color: "#ff0000" },
  ];

  console.log(chartData, "chartData");

  return (
    <div>
      <div className=" min-h-screen">
        {/* barchart with prenate children  */}

        {/* Bar Chart  */}
        <div
          className="p-4 m-2 rounded-lg shadow-md"
          style={{ width: "99%", height: "100vh" }}
        >
          <div className="flex items-center justify-between">
            {chartData &&
              chartData.map((item) => (
                <h2
                  key={item.id}
                  className="xl:text-3xl lg:text-2xl font-bold mb-4"
                >
                  Barchart for {item.name}
                </h2>
              ))}
            <Link
              href="/"
              className="hover:text-green-600 transition-transform transform active:scale-95"
            >
              Go To Back
            </Link>
          </div>

          <div
            className=""
            style={{ width: "100%", height: "100%", minHeight: "400px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3 3" />
                <XAxis
                  dataKey="name"
                  angle={0}
                  textAnchor="middle"
                  height={70}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "savingsRatio" || "otr" || "srratio")
                      return `${value}%`;
                    return value;
                  }}
                />

                <Legend verticalAlign="top" height={36} />
                {valueColumns.map((column) => (
                  <Bar
                    key={column.id}
                    dataKey={column.id}
                    name={column.name}
                    fill={column.color}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-2 rounded-lg items-center justify-center flex-col">
          <AreaChartCompo></AreaChartCompo>
        </div>
      </div>
    </div>
  );
};

export default ChildrenChart;
