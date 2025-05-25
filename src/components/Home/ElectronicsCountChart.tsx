// "use client";
// import Link from "next/link";
// import { TfiLayoutMenuSeparated } from "react-icons/tfi";
// import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
// import { useTheme } from "next-themes";
// import { useMemo } from "react";

// const ElectronicsCountChart = () => {
//   const { theme } = useTheme();

//   const data = useMemo(() => [
//     {
//       name: "Total",
//       price: 6563,
//       fill: theme === "dark" ? "#312c4a" : "white", // Change color based on theme
//     },
//     {
//       name: "Buy",
//       price: 4534,
//       fill: "#00A9B4",
//     },
//     {
//       name: "Sells",
//       price: 3342,
//       fill: "#0A3A66",
//     },
//   ], [theme]);

//   return (
//     <Link href={`/category/${1}`}>
//       <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
//         {/* TITLE */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-lg font-semibold text-black dark:text-white">Electronics</h1>
//           <TfiLayoutMenuSeparated width={20} height={20} className="text-black dark:text-white" />
//         </div>

//         {/* CHART */}
//         <div className="w-full h-[75%]">
//           <ResponsiveContainer>
//             <RadialBarChart
//               cx="50%"
//               cy="50%"
//               innerRadius="40%"
//               outerRadius="100%"
//               barSize={32}
//               data={data}
//             >
//               <RadialBar background dataKey="price" />
//             </RadialBarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* BOTTOM */}
//         <div className="flex justify-center gap-16">
//           <div className="flex flex-col gap-1 items-center">
//             <div className="w-5 h-5 bg-[#00A9B4] rounded-full" />
//             <h1 className="font-bold text-black dark:text-white">1,234</h1>
//             <h2 className="text-xs text-gray-500 dark:text-gray-300">Buy</h2>
//           </div>
//           <div className="flex flex-col gap-1 items-center">
//             <div className="w-5 h-5 bg-[#0A3A66] rounded-full" />
//             <h1 className="font-bold text-black dark:text-white">1,234</h1>
//             <h2 className="text-xs text-gray-500 dark:text-gray-300">Sells</h2>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ElectronicsCountChart;

"use client";

import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Locale, isValidLocale } from "@/i18n/routing";

interface ChartDataItem {
  name: string;
  price: number;
  count: number;
  fill?: string;
}

interface ElectronicsChartTranslations {
  title: string;
  buyLabel: string;
  sellsLabel: string;
  data: ChartDataItem[];
}

interface TranslationMessages {
  homeCategory?: {
    electronicsChart?: ElectronicsChartTranslations;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const ElectronicsCountChart = () => {
  const { theme } = useTheme();
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

        // Set chart data from JSON, adjusting fill color for Total based on theme
        const electronicsChart = msgs.homeCategory?.electronicsChart;
        if (electronicsChart?.data) {
          const updatedData = electronicsChart.data.map((item: ChartDataItem) =>
            item.name === "Total" || item.name === "Total" // Handle translated names
              ? { ...item, fill: theme === "dark" ? "#312c4a" : "white" }
              : item
          );
          setChartData(updatedData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Error loading translations or chart data:", error);
        setT({});
        setChartData([]);
      }
    })();
  }, [currentLocale, theme]);

  // Fallback data if JSON loading fails
  const fallbackData = useMemo(
    () => [
      {
        name: "Total",
        price: 6563,
        count: 2434,
        fill: theme === "dark" ? "#312c4a" : "white",
      },
      {
        name: "Buy",
        price: 4534,
        count: 1234,
        fill: "#00A9B4",
      },
      {
        name: "Sells",
        price: 3342,
        count: 1234,
        fill: "#0A3A66",
      },
    ],
    [theme]
  );

  const data = chartData.length > 0 ? chartData : fallbackData;

  return (
    <Link href={`/${currentLocale}/category/1`}>
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            {t.homeCategory?.electronicsChart?.title || "Electronics"}
          </h1>
          <TfiLayoutMenuSeparated
            width={20}
            height={20}
            className="text-black dark:text-white"
          />
        </div>

        {/* CHART */}
        <div className="w-full h-[75%]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={data}
            >
              <RadialBar background dataKey="price" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM */}
        <div className="flex justify-center gap-16">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-[#00A9B4] rounded-full" />
            <h1 className="font-bold text-black dark:text-white">
              {data.find(
                (item) =>
                  item.name === "Buy" ||
                  item.name === t.homeCategory?.electronicsChart?.buyLabel
              )?.count || 1234}
            </h1>
            <h2 className="text-xs text-gray-500 dark:text-gray-300">
              {t.homeCategory?.electronicsChart?.buyLabel || "Buy"}
            </h2>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-[#0A3A66] rounded-full" />
            <h1 className="font-bold text-black dark:text-white">
              {data.find(
                (item) =>
                  item.name === "Sells" ||
                  item.name === t.homeCategory?.electronicsChart?.sellsLabel
              )?.count || 1234}
            </h1>
            <h2 className="text-xs text-gray-500 dark:text-gray-300">
              {t.homeCategory?.electronicsChart?.sellsLabel || "Sells"}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ElectronicsCountChart;
