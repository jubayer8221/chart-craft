"use client";

import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Locale, isValidLocale } from "@/i18n/routing";

interface ChartDataItem {
  name: string;
  price: number;
  fill?: string;
}

interface LegendPayload {
  name: string;
  price: number;
  fill?: string;
}

interface ToysChartTranslations {
  title: string;
  buyLabel: string;
  sellsLabel: string;
  totalLabel: string;
  buyCount: number;
  sellsCount: number;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    toysChart?: ToysChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const ToysChart = () => {
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isValidLocale(currentLocaleCode)) {
      localStorage.setItem("preferredLocale", currentLocaleCode);
    }
  }, [currentLocaleCode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);
        const toysChart = msgs.homeCategory?.toysChart;
        if (toysChart?.data) {
          setChartData(toysChart.data);
        } else {
          console.warn("ToysChart data not found in JSON, using fallback");
          setChartData([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error loading translations or chart data:", error);
        setT({});
        setChartData([]);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentLocale]);

  const fallbackData: ChartDataItem[] = [
    { name: "Total", price: 6563 },
    { name: "Buy", price: 4534, fill: "#00A9B4" },
    { name: "Sells", price: 3342, fill: "#0A3A66" },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

  // Apply dynamic fill for Total at render time
  const processedData = data.map((item) =>
    item.name === t.homeCategory?.toysChart?.totalLabel || item.name === "Total"
      ? { ...item, fill: isDarkMode ? "#333" : "white" }
      : item
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex items-center justify-center">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-black dark:text-white">
          {t.homeCategory?.toysChart?.title || "Toys"}
        </h1>
        <Link href={`/${currentLocale}/category/5`}>
          <TfiLayoutMenuSeparated
            className="text-black dark:text-white"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <div className="w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={processedData}
          >
            <RadialBar
              background
              dataKey="price"
              label={{ fill: isDarkMode ? "#fff" : "#000", fontSize: 12 }}
            />
            <Legend
              formatter={(value, entry) => {
                // Ensure payload exists and has name property
                const payload = entry?.payload as LegendPayload | undefined;
                if (!payload || !payload.name) {
                  return value; // Fallback to value if payload is missing
                }
                const name = payload.name;
                if (
                  name === t.homeCategory?.toysChart?.totalLabel ||
                  name === "Total"
                ) {
                  return t.homeCategory?.toysChart?.totalLabel || "Total";
                }
                if (
                  name === t.homeCategory?.toysChart?.buyLabel ||
                  name === "Buy"
                ) {
                  return t.homeCategory?.toysChart?.buyLabel || "Buy";
                }
                return t.homeCategory?.toysChart?.sellsLabel || "Sells";
              }}
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: "10px" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#00A9B4] rounded-full" />
          <h1 className="font-bold text-black dark:text-white">
            {t.homeCategory?.toysChart?.buyCount || 1234}
          </h1>
          <h2 className="text-xs text-gray-500 dark:text-gray-300">
            {t.homeCategory?.toysChart?.buyLabel || "Buy"}
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#0A3A66] rounded-full" />
          <h1 className="font-bold text-black dark:text-white">
            {t.homeCategory?.toysChart?.sellsCount || 1234}
          </h1>
          <h2 className="text-xs text-gray-500 dark:text-gray-300">
            {t.homeCategory?.toysChart?.sellsLabel || "Sells"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ToysChart;
