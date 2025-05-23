"use client";

import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  LineChart,
  Line,
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
  income: number;
  expense: number;
}

interface ClothingsChartTranslations {
  title: string;
  incomeLabel: string;
  expenseLabel: string;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    clothingsChart?: ClothingsChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const ClothingsChart = () => {
  const params = useParams();

  // Get locale from URL, fallback to localStorage or default to 'en'
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

  // Store selected locale in localStorage
  useEffect(() => {
    if (isValidLocale(currentLocaleCode)) {
      localStorage.setItem("preferredLocale", currentLocaleCode);
    }
  }, [currentLocaleCode]);

  // Load translations and chart data from JSON
  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);

        // Set chart data from JSON
        const clothingsChart = msgs.homeCategory?.clothingsChart;
        if (clothingsChart?.data) {
          setChartData(clothingsChart.data);
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

  // Fallback data if JSON loading fails
  const fallbackData: ChartDataItem[] = [
    { name: "Jan", income: 4000, expense: 2400 },
    { name: "Feb", income: 3000, expense: 1398 },
    { name: "Mar", income: 2000, expense: 9800 },
    { name: "Apr", income: 2780, expense: 3908 },
    { name: "May", income: 1890, expense: 4800 },
    { name: "Jun", income: 2390, expense: 3800 },
    { name: "Jul", income: 3490, expense: 4300 },
    { name: "Aug", income: 3490, expense: 4300 },
    { name: "Sep", income: 3490, expense: 4300 },
    { name: "Oct", income: 3490, expense: 4300 },
    { name: "Nov", income: 3490, expense: 4300 },
    { name: "Dec", income: 3490, expense: 4300 },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

  return (
    <Link href={`/${currentLocale}/category/2`}>
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            {t.homeCategory?.clothingsChart?.title || "Clothing"}
          </h1>
          <TfiLayoutMenuSeparated
            width={20}
            height={20}
            className="text-black dark:text-white"
          />
        </div>
        {/* MIDDLE */}
        <div className="w-full h-[75%]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
                tickMargin={20}
              />
              <Tooltip />
              <Legend
                align="center"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
                formatter={(value) =>
                  value === "income"
                    ? t.homeCategory?.clothingsChart?.incomeLabel || "Income"
                    : t.homeCategory?.clothingsChart?.expenseLabel || "Expense"
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#0A3A66"
                strokeWidth={5}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#00A9B4"
                strokeWidth={5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
};

export default ClothingsChart;
