"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useParams } from "next/navigation";
import data from "../../../../data/data";
import Link from "next/link";

const AreaChartCompo = () => {
  const params = useParams();
  const { id } = params;
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recursive function to find item by ID
  const findItemById = (items, id) => {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.children && Array.isArray(item.children)) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      const item = findItemById(data, id);
      // console.log("Found item:", item); // Debug: Log the found items
      if (item) {
        setChartData(item);
      } else {
        setChartData(null);
      }
      setLoading(false);
    }
  }, [id]);

  const [chartConfig, setChartConfig] = useState({
    stacked: false,
    horizontal: false,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
  });

  // Dynamic chart rendering
  // const renderChart = () => {
  //   if (!labelColumn || !valueColumns.length || !processedData.length) {
  //     return (
  //       <div className="py-6 my-2 text-center text-gray-500">
  //         Please select a label column and at least one numeric value column
  //       </div>
  //     );
  //   }
  // };

  //   const xAxisProps = {
  //     dataKey: data.id,
  //     name: data.name || "Name",
  //     angle: chartConfig.horizontal ? 0 : -45,
  //     textAnchor: chartConfig.horizontal ? "middle" : "end",
  //     height: 70,
  //     scale: chartConfig.horizontal ? "band" : "auto",
  //   };

  // Process data with explicit type checking

  const processedData = chartData?.children?.length
    ? chartData.children.map((item) => ({
        id: item.id,
        name: item.name,
        borr: Number(item.borr),
        os: Number(item.os),
        avgos: Number(item.avgos),
        otr: parseFloat(item.otr),
        disbursement: Number(item.disbursement),
        savings: Number(item.savings),
        savingsRatio: parseFloat(item.savingsRatio),
        totalcollection: Number(item.totalcollection),
        serviceCharge: Number(item.serviceCharge),
        savingscollection: Number(item.savingscollection),
        overdue: Number(item.overdue) || 0,
        cashandbank: Number(item.cashandbank) || 0,
        savingsRatio: Number(item.savingsRatio) || 0,
        srratio: parseFloat(item.srratio),
        savingsrtn: Number(item.savingsrtn) || 0,
      }))
    : chartData
    ? [
        {
          id: chartData.id,
          name: chartData.name,
          borr: Number(chartData.borr) || 0,
          savings: Number(chartData.savings) || 0,
          totalcollection: Number(chartData.totalcollection) || 0,
          serviceCharge: Number(chartData.serviceCharge) || 0,
          savingscollection: Number(chartData.savingscollection) || 0,
          os: Number(chartData.os) || 0,
          avgos: Number(chartData.avgos) || 0,
          otr: parseFloat(chartData.otr),
          disbursement: Number(chartData.disbursement) || 0,
          savingsRatio: parseFloat(chartData.savingsRatio),
          cashandbank: Number(chartData.cashandbank) || 0,
          srratio: parseFloat(chartData.srratio) || 0,
          savingsrtn: Number(chartData.savingsrtn) || 0,
          overdue: Number(chartData.overdue) || 0,
        },
      ]
    : [];

  // const processedData = chartData
  //   ? [
  //       {
  //         id: chartData.id,
  //         name: chartData.name,
  //         borr: Number(chartData.borr) || 0,
  //         savings: Number(chartData.savings) || 0,
  //         totalcollection: Number(chartData.totalcollection) || 0,
  //         serviceCharge: Number(chartData.serviceCharge) || 0,
  //         savingscollection: Number(chartData.savingscollection) || 0,
  //         os: Number(chartData.os) || 0,
  //         avgos: Number(chartData.avgos) || 0,
  //         otr: parseFloat(chartData.otr),
  //         disbursement: Number(chartData.disbursement) || 0,
  //         savingsRatio: parseFloat(chartData.savingsRatio),
  //         cashandbank: Number(chartData.cashandbank) || 0,
  //         srratio: parseFloat(chartData.srratio) || 0,
  //         savingsrtn: Number(chartData.savingsrtn) || 0,
  //         overdue: Number(chartData.overdue) || 0,
  //       },
  //     ]
  //   : [];

  const commonProps = {
    data: processedData,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
    layout: chartConfig.horizontal ? "vertical" : "horizontal",
    animationDuration: 900,
    animationEasing: "ease-in-out",
  };

  console.log("Processed Data:", processedData);

  const valueColumns = [
    { id: "savings", name: "Savings", color: "#82ca9d" },
    { id: "totalcollection", name: "Total Collection", color: "#8884d8" },
    // { id: "savingsRatio", name: "Savings Ratio", color: "#ff00ff" },
    { id: "os", name: "OS", color: "#2E8B57" },
    { id: "avgos", name: "AvgOS", color: "#00ffff" },
    // { id: "otr", name: "OTR", color: "#ff7f50" },
    { id: "serviceCharge", name: "Service Charge", color: "#ffc658" },
    { id: "savingscollection", name: "Savings Collection", color: "#ff7300" },
    { id: "savingsrtn", name: "Savings Return", color: "#6495ed" },
    // { id: "srratio", name: "SR Ratio", color: "#dc143c" },
    { id: "disbursement", name: "Disbursement", color: "#38A3A5" },
    { id: "cashandbank", name: "Cash&Bank", color: "#00ff00" },
    { id: "overdue", name: "Overdue", color: "#ff0000" },
  ];

  // Handle loading and error states
  if (loading) {
    return <div className="p-4 text-xl">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Area Chart */}
      <div
        className="p-4 bg-white min-h-screen shadow-md rounded-lg"
        style={{ width: "100%", height: "99vh" }} // Ensure container has height
      >
        <div className="flex items-center justify-between">
          <h1 className="lg:text-3xl md:text-2xl font-bold mb-4">
            Area Chart of {chartData.name}
          </h1>
          <Link href="/" className="hover:text-green-600">
            Go To Back
          </Link>
        </div>
        <div style={{ width: "100%", height: "100%", minHeight: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data.name} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "savingsRatio" || "otr" || "srratio")
                    return `${value}%`;
                  else {
                    return value;
                  }
                }}
              />
              <Legend />
              {valueColumns.map((column) => (
                <Area
                  type="monotone"
                  key={column.name}
                  dataKey={column.id}
                  name={column.name}
                  stroke={column.color}
                  fill={column.color}
                  fillOpacity={0.4}
                  stackId={column.id}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div
        className="p-4 bg-white shadow-md rounded-lg"
        style={{ width: "100%", height: "99vh" }} // Ensure container has height
      >
        <div className="flex items-center justify-between">
          <h1 className="lg:text-3xl md:text-2xl font-bold mb-4">
            Area Chart of {chartData.name}
          </h1>
          <Link href="/" className="hover:text-green-600">
            Go To Back
          </Link>
        </div>
        <div
          style={{ width: "98%", height: "90%", minHeight: "400px" }}
          className=""
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={processedData}>
              <XAxis dataKey={processedData.name} />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              {valueColumns.map((column) => (
                <Line
                  type="monotone"
                  dataKey={column.id}
                  stroke={column.color}
                />
              ))}
              {/* <Line type="monotone" dataKey={data.id} stroke="#82ca9d" /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div
        className="p-4 bg-white shadow-md rounded-lg"
        style={{ width: "100%", height: "99vh" }} // Ensure container has height
      >
        <div className="flex items-center justify-between">
          <h1 className="lg:text-3xl md:text-2xl font-bold mb-4">
            Pie Chart of {chartData?.name}
          </h1>
          <Link href="/" className="hover:text-green-600">
            Go To Back
          </Link>
        </div>
        <div
          style={{ width: "100%", height: "80%", minHeight: "70vh" }}
          className="mt-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                outerRadius={200}
                fill="#8884d8"
                dataKey="savings" // Change this to whichever metric you want to show
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={valueColumns[index % valueColumns.length].color}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AreaChartCompo;
