"use client";

import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Locale, isValidLocale } from "@/i18n/routing";

interface ChartDataItem {
  name: string;
  buy: number;
  sells: number;
}

interface FurnituresChartTranslations {
  title: string;
  buyLabel: string;
  sellsLabel: string;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    furnituresChart?: FurnituresChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const FurnituresChart = () => {
  const params = useParams();
  const currentLocaleCode =
    (params.lang as Locale) ||
    (typeof window !== "undefined" &&
      (localStorage.getItem("preferredLocale") as Locale)) ||
    "en";
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : "en";

  const [t, setT] = useState<TranslationMessages>({});
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    if (isValidLocale(currentLocaleCode)) {
      localStorage.setItem("preferredLocale", currentLocaleCode);
    }
  }, [currentLocaleCode]);

  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);
        const furnituresChart = msgs.homeCategory?.furnituresChart;
        if (furnituresChart?.data) {
          setChartData(furnituresChart.data);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Error loading translations or chart data:", error);
        setT({});
        setChartData([]);
      }
    })();
  }, [currentLocale]);

  const fallbackData: ChartDataItem[] = [
    { name: "Mon", buy: 60, sells: 40 },
    { name: "Tue", buy: 70, sells: 60 },
    { name: "Wed", buy: 90, sells: 75 },
    { name: "Thu", buy: 90, sells: 75 },
    { name: "Fri", buy: 65, sells: 55 },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

  return (
    <Link href={`/${currentLocale}/category/4`}>
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            {t.homeCategory?.furnituresChart?.title || "Furniture"}
          </h1>
          <TfiLayoutMenuSeparated
            className="text-black dark:text-white"
            width={20}
            height={20}
          />
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
              formatter={(value) =>
                value === "buy"
                  ? t.homeCategory?.furnituresChart?.buyLabel || "Buy"
                  : t.homeCategory?.furnituresChart?.sellsLabel || "Sells"
              }
            />
            <Bar
              dataKey="buy"
              fill="#00A9B4"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="sells"
              fill="#0A3A66"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
};

export default FurnituresChart;
