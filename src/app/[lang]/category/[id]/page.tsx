// "use client";

// import Link from "next/link";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { notFound, useParams } from "next/navigation";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import { useState, useEffect } from "react";
// import { Locale, isValidLocale } from "@/i18n/routing";

// interface CategoryItem {
//   item: string;
//   price: number;
//   oldPrice?: number;
//   quality?: string;
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0A3A66"];

// export default function CategoryPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const currentLocaleCode = (params.lang as Locale) || "en";
//   const currentLocale = isValidLocale(currentLocaleCode)
//     ? currentLocaleCode
//     : "en";

//   interface HomeCategoryMessages {
//     table?: string;
//     item?: string;
//     itemPrice?: string;
//     itemOldPrice?: string;
//     itemQuality?: string;
//     barChart?: string;
//     pieChart?: string;
//     buySellReport?: string;
//     categoryList?: Array<Record<string, CategoryItem[]>>;
//     [key: string]: unknown;
//   }

//   interface TranslationMessages {
//     homeCategory?: HomeCategoryMessages;
//     home?: string;
//     [key: string]: unknown;
//   }

//   const [t, setT] = useState<TranslationMessages>({});
//   const [rows, setRows] = useState<CategoryItem[]>([]);
//   const [categoryName, setCategoryName] = useState<string>("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
//           .default;
//         setT(msgs);

//         // Find the category data by ID in categoryList
//         const category = msgs.homeCategory?.categoryList?.find(
//           (cat: Record<string, CategoryItem[]>) => Object.keys(cat)[0] === id
//         );

//         if (category && category[id]) {
//           setRows(category[id]);
//           setCategoryName(msgs.homeCategory[id] || `Category ${id}`);
//         } else {
//           setRows([]);
//           setCategoryName("Unknown Category");
//         }
//       } catch (error) {
//         console.error("Error loading translations or category data:", error);
//         setT({});
//         setRows([]);
//         setCategoryName("Unknown Category");
//       }
//     })();
//   }, [currentLocale, id]);

//   // If no rows are found after loading, trigger notFound
//   if (!rows.length && t.homeCategory) {
//     return notFound();
//   }

//   const data01 = rows.map((item) => ({
//     name: item.item,
//     value: item.price,
//   }));

//   const data02 = rows
//     .filter((item) => item.oldPrice)
//     .map((item) => ({
//       name: item.item,
//       value: item.oldPrice || 0,
//     }));

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const items = Array.from(rows);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setRows(items);
//   };

//   return (
//     <div className="">
//       <h1 className="text-2xl bg-[#0A3A66] text-white font-bold my-2 text-center p-3 shadow-lg">
//         {categoryName}
//       </h1>
//       <div className="flex flex-wrap gap-4 justify-center items-start w-full mx-auto">
//         <div className="w-full rounded-lg p-4 shadow-lg min-w-[300px] max-w-screen">
//           <h1 className="text-xl font-semibold my-4">
//             {t.homeCategory?.table || "Table"}
//           </h1>

//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="category-table">
//               {(provided) => (
//                 <table
//                   className="w-full h-[270px] mb-8 text-center"
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   <thead>
//                     <tr className="bg-[#00A9B4] text-white">
//                       <th className="p-2">{t.homeCategory?.item || "Item"}</th>
//                       <th className="p-2">
//                         {t.homeCategory?.itemPrice || "Price"}
//                       </th>
//                       <th className="p-2">
//                         {t.homeCategory?.itemOldPrice || "Old Price"}
//                       </th>
//                       <th className="p-2">
//                         {t.homeCategory?.itemQuality || "Quality"}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row, index) => (
//                       <Draggable
//                         key={row.item + index}
//                         draggableId={row.item + index}
//                         index={index}
//                       >
//                         {(provided, snapshot) => (
//                           <tr
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className={`border-y-[1px] ${
//                               snapshot.isDragging
//                                 ? "bg-gray-200"
//                                 : "hover:bg-gray-100"
//                             }`}
//                           >
//                             <td className="p-2">{row.item}</td>
//                             <td className="p-2">${row.price}</td>
//                             <td className="p-2">
//                               {row.oldPrice ? `$${row.oldPrice}` : "N/A"}
//                             </td>
//                             <td className="p-2">{row.quality || "N/A"}</td>
//                           </tr>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </tbody>
//                 </table>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </div>

//         <div className="w-full rounded-lg p-4 shadow-lg max-w-screen hover:shadow-lg transition-shadow duration-300">
//           <h1 className="text-xl font-semibold my-4">
//             {t.homeCategory?.barChart || "Bar Chart"}
//           </h1>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart layout="vertical" data={rows} margin={{ left: 50 }}>
//               <XAxis type="number" />
//               <YAxis type="category" dataKey="item" />
//               <Tooltip />
//               <Bar dataKey="price" fill="#00A9B4" />
//               <Bar dataKey="oldPrice" fill="#0A3A66" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="w-full rounded-lg p-4 shadow-lg min-w-[300px] max-w-screen hover:border-b-[#3c6e71]">
//           <h1 className="text-xl font-semibold my-4">
//             {t.homeCategory?.pieChart || "Pie Chart"}
//           </h1>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart width={400} height={400}>
//               <Pie
//                 data={data01}
//                 dataKey="value"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={60}
//                 fill="#8884d8"
//               >
//                 {data01.map((_, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Pie
//                 data={data02}
//                 dataKey="value"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={70}
//                 outerRadius={90}
//                 fill="#82ca9d"
//                 label
//               >
//                 {data02.map((_, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="flex items-center mt-8">
//         <div className="flex justify-around">
//           <Link href={`/${currentLocale}/page/buySellChart`}>
//             <button className="px-4 py-2 rounded bg-[#0A3A66] hover:bg-[#007EA1] text-white transition m-5 active:scale-95">
//               {t.homeCategory?.buySellReport || "Buy & Sell Report"}
//             </button>
//           </Link>
//         </div>
//         <div className="flex justify-center">
//           <Link href={`/${currentLocale}/`}>
//             <button className="px-4 py-2 bg-[#0A3A66] hover:bg-[#007EA1] text-white rounded transition active:scale-95">
//               {t.home || "Home"}
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { notFound, useParams } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Locale, isValidLocale } from "@/i18n/routing";

interface CategoryItem {
  item: string;
  price: number;
  oldPrice?: number;
  quality?: string;
}

interface HomeCategoryMessages {
  table?: string;
  item?: string;
  itemPrice?: string;
  itemOldPrice?: string;
  itemQuality?: string;
  barChart?: string;
  pieChart?: string;
  buySellReport?: string;
  categoryList?: Array<Record<string, CategoryItem[]>>;
  [key: string]: unknown;
}

interface TranslationMessages {
  homeCategory?: HomeCategoryMessages;
  home?: string;
  [key: string]: unknown;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0A3A66"];

export default function CategoryPage() {
  const params = useParams();
  // const pathname = usePathname();
  const id = params.id as string;

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
  const [rows, setRows] = useState<CategoryItem[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");

  // Store selected locale in localStorage
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

        // Find the category data by ID in categoryList
        const category = msgs.homeCategory?.categoryList?.find(
          (cat: Record<string, CategoryItem[]>) => Object.keys(cat)[0] === id
        );

        if (category && category[id]) {
          setRows(category[id]);
          setCategoryName(msgs.homeCategory[id] || `Category ${id}`);
        } else {
          setRows([]);
          setCategoryName("Unknown Category");
        }
      } catch (error) {
        console.error("Error loading translations or category data:", error);
        setT({});
        setRows([]);
        setCategoryName("Unknown Category");
      }
    })();
  }, [currentLocale, id]);

  // If no rows are found after loading, trigger notFound
  if (!rows.length && t.homeCategory) {
    return notFound();
  }

  const data01 = rows.map((item) => ({
    name: item.item,
    value: item.price,
  }));

  const data02 = rows
    .filter((item) => item.oldPrice)
    .map((item) => ({
      name: item.item,
      value: item.oldPrice || 0,
    }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRows(items);
  };

  return (
    <div className="">
      <h1 className="text-2xl bg-[#0A3A66] text-white font-bold my-2 text-center p-3 shadow-lg">
        {categoryName}
      </h1>
      <div className="flex flex-wrap gap-4 justify-center items-start w-full mx-auto">
        <div className="w-full rounded-lg p-4 shadow-lg min-w-[300px] max-w-screen">
          <h1 className="text-xl font-semibold my-4">
            {t.homeCategory?.table || "Table"}
          </h1>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="category-table">
              {(provided) => (
                <table
                  className="w-full h-[270px] mb-8 text-center"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead>
                    <tr className="bg-[#00A9B4] text-white">
                      <th className="p-2">{t.homeCategory?.item || "Item"}</th>
                      <th className="p-2">
                        {t.homeCategory?.itemPrice || "Price"}
                      </th>
                      <th className="p-2">
                        {t.homeCategory?.itemOldPrice || "Old Price"}
                      </th>
                      <th className="p-2">
                        {t.homeCategory?.itemQuality || "Quality"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <Draggable
                        key={row.item + index}
                        draggableId={row.item + index}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border-y-[1px] ${
                              snapshot.isDragging
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <td className="p-2">{row.item}</td>
                            <td className="p-2">${row.price}</td>
                            <td className="p-2">
                              {row.oldPrice ? `$${row.oldPrice}` : "N/A"}
                            </td>
                            <td className="p-2">{row.quality || "N/A"}</td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="w-full rounded-lg p-4 shadow-lg max-w-screen hover:shadow-lg transition-shadow duration-300">
          <h1 className="text-xl font-semibold my-4">
            {t.homeCategory?.barChart || "Bar Chart"}
          </h1>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={rows} margin={{ left: 50 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="item" />
              <Tooltip />
              <Bar dataKey="price" fill="#00A9B4" />
              <Bar dataKey="oldPrice" fill="#0A3A66" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full rounded-lg p-4 shadow-lg min-w-[300px] max-w-screen hover:border-b-[#3c6e71]">
          <h1 className="text-xl font-semibold my-4">
            {t.homeCategory?.pieChart || "Pie Chart"}
          </h1>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={400} height={400}>
              <Pie
                data={data01}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {data01.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Pie
                data={data02}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                label
              >
                {data02.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center mt-8">
        <div className="flex justify-around">
          <Link href={`/${currentLocale}/page/buySellChart`}>
            <button className="px-4 py-2 rounded bg-[#0A3A66] hover:bg-[#007EA1] text-white transition m-5 active:scale-95">
              {t.homeCategory?.buySellReport || "Buy & Sell Report"}
            </button>
          </Link>
        </div>
        <div className="flex justify-center">
          <Link href={`/${currentLocale}/`}>
            <button className="px-4 py-2 bg-[#0A3A66] hover:bg-[#007EA1] text-white rounded transition active:scale-95">
              {t.home || "Home"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
