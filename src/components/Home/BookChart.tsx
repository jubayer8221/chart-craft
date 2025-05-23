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
  Sells: number;
  Buy: number;
}

interface BooksChartTranslations {
  title: string;
  buyLabel: string;
  sellsLabel: string;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    booksChart?: BooksChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const BookChart = () => {
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
        const booksChart = msgs.homeCategory?.booksChart;
        if (booksChart?.data) {
          setChartData(booksChart.data);
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
    { name: "2025", Sells: 4000, Buy: 2400 },
    { name: "2024", Sells: 3000, Buy: 1398 },
    { name: "2023", Sells: 2000, Buy: 9800 },
    { name: "2022", Sells: 2780, Buy: 3908 },
    { name: "2021", Sells: 1890, Buy: 4800 },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

  return (
    <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-black dark:text-white">
          {t.homeCategory?.booksChart?.title || "Books"}
        </h1>
        <Link href={`/${currentLocale}/category/6`}>
          <TfiLayoutMenuSeparated
            className="text-black dark:text-white"
            size={20}
          />
        </Link>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          layout="vertical"
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip />
          <Legend
            formatter={(value) =>
              value === "Buy"
                ? t.homeCategory?.booksChart?.buyLabel || "Buy"
                : t.homeCategory?.booksChart?.sellsLabel || "Sells"
            }
          />
          <Line dataKey="Sells" stroke="#0A3A66" strokeWidth={2} />
          <Line dataKey="Buy" stroke="#00A9B4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookChart;
