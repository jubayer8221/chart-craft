"use client";

import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { PieChart, Pie, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Locale, isValidLocale } from "@/i18n/routing";

interface ChartDataItem {
  name: string;
  price: number;
  fill: string;
}

interface LegendPayload {
  name: string;
  price: number;
  fill: string;
}

interface GroceriesChartTranslations {
  title: string;
  buyLabel: string;
  sellsLabel: string;
  percentage: string;
  maxLTS: string;
  yearRange: string;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    groceriesChart?: GroceriesChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const GroceriesChart = () => {
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

  // Function to consolidate data by name
  const consolidateData = (data: ChartDataItem[]): ChartDataItem[] => {
    const aggregated = data.reduce((acc, item) => {
      const key = item.name;
      if (!acc[key]) {
        acc[key] = { name: item.name, price: 0, fill: item.fill };
      }
      acc[key].price += item.price;
      return acc;
    }, {} as Record<string, ChartDataItem>);
    const result = Object.values(aggregated);
    console.log("Consolidated data:", result); // Debug log
    return result;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);
        const groceriesChart = msgs.homeCategory?.groceriesChart;
        if (groceriesChart?.data) {
          setChartData(consolidateData(groceriesChart.data));
        } else {
          console.warn("GroceriesChart data not found in JSON, using fallback");
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
    { name: "Buy", price: 1032, fill: "#00A9B4" },
    { name: "Sells", price: 709, fill: "#0A3A66" },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

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
    <Link href={`/${currentLocale}/category/3`}>
      <div className="relative bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            {t.homeCategory?.groceriesChart?.title || "Groceries"}
          </h1>
          <TfiLayoutMenuSeparated
            className="text-black dark:text-white"
            width={20}
            height={20}
          />
        </div>
        <div className="w-full h-[80%]">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="price"
                nameKey="name"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                label={{ fill: isDarkMode ? "#fff" : "#000", fontSize: 12 }}
                labelLine={false}
              />
              <Legend
                formatter={(value, entry) => {
                  const payload = entry?.payload as LegendPayload | undefined;
                  if (!payload || !payload.name) {
                    return value; // Fallback to value if payload is missing
                  }
                  const name = payload.name;
                  return name === t.homeCategory?.groceriesChart?.buyLabel
                    ? t.homeCategory?.groceriesChart?.buyLabel
                    : t.homeCategory?.groceriesChart?.sellsLabel;
                }}
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {t.homeCategory?.groceriesChart?.percentage || "92%"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {t.homeCategory?.groceriesChart?.maxLTS || "of 10 max LTS"}
          </p>
        </div>
        <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center text-black dark:text-white">
          {t.homeCategory?.groceriesChart?.yearRange || "2024 Year - 2025 Year"}
        </h2>
      </div>
    </Link>
  );
};

export default GroceriesChart;
