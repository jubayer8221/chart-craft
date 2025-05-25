// "use client";
// import React from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import { useState } from "react";
// import Image from "next/image";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// interface SellItem {
//   id: number;
//   title: string;
//   description?: string;
//   image: string;
//   price: number;
//   discount: string;
//   sold: number;
//   totalOrder: number;
// }

// const sellData: SellItem[] = [
//   {
//     id: 1,
//     title: "Blue T-shirt",
//     description: "A stylish blue t-shirt",
//     image: "/image/blue_tshirt.png",
//     price: 100,
//     discount: "15%",
//     sold: 300,
//     totalOrder: 100,
//   },
//   {
//     id: 2,
//     title: "Red Hoodie",
//     description: "Cozy and warm red hoodie",
//     image: "/image/blue_tshirt.png",
//     price: 150,
//     discount: "20%",
//     sold: 200,
//     totalOrder: 80,
//   },
//   {
//     id: 3,
//     title: "Black Jeans",
//     description: "Comfortable black jeans",
//     image: "/image/blue_tshirt.png",
//     price: 200,
//     discount: "10%",
//     sold: 400,
//     totalOrder: 200,
//   },
//   {
//     id: 4,
//     title: "White Sneakers",
//     description: "Trendy white sneakers",
//     image: "/image/blue_tshirt.png",
//     price: 250,
//     discount: "25%",
//     sold: 500,
//     totalOrder: 500,
//   },
//   {
//     id: 5,
//     title: "Green Jacket",
//     description: "Warm green jacket",
//     image: "/image/blue_tshirt.png",
//     price: 300,
//     discount: "30%",
//     sold: 150,
//     totalOrder: 400,
//   },
//   {
//     id: 6,
//     title: "Yellow Scarf",
//     description: "Bright yellow scarf",
//     image: "/image/blue_tshirt.png",
//     price: 50,
//     discount: "5%",
//     sold: 600,
//     totalOrder: 750,
//   },
//   {
//     id: 7,
//     title: "Brown Boots",
//     description: "Durable brown boots",
//     image: "/image/blue_tshirt.png",
//     price: 400,
//     discount: "20%",
//     sold: 250,
//     totalOrder: 700,
//   },
//   {
//     id: 8,
//     title: "Purple Hat",
//     description: "Stylish purple hat",
//     image: "/image/blue_tshirt.png",
//     price: 80,
//     discount: "10%",
//     sold: 350,
//     totalOrder: 900,
//   },
//   {
//     id: 9,
//     title: "Sunglasses",
//     description: "Cool orange sunglasses",
//     image: "/image/blue_tshirt.png",
//     price: 120,
//     discount: "15%",
//     sold: 450,
//     totalOrder: 650,
//   },
//   {
//     id: 10,
//     title: "Gray Gloves",
//     description: "Comfortable gray gloves",
//     image: "/image/blue_tshirt.png",
//     price: 60,
//     discount: "5%",
//     sold: 700,
//     totalOrder: 400,
//   },
//   {
//     id: 11,
//     title: "Pink Dress",
//     description: "Elegant pink dress",
//     image: "/image/blue_tshirt.png",
//     price: 500,
//     discount: "25%",
//     sold: 350,
//     totalOrder: 500,
//   },
//   {
//     id: 12,
//     title: "Blue Cap",
//     description: "Casual blue cap",
//     image: "/image/blue_tshirt.png",
//     price: 40,
//     discount: "10%",
//     sold: 400,
//     totalOrder: 600,
//   },
// ];

// const TopSelling = () => {
//   const [data, setData] = useState<SellItem[]>(sellData);
//   const [filter] = useState("");
//   const [showAll, setShowAll] = useState(false);
//   const [cards, setCards] = useState(["top-selling", "stock-report"]);

//   const filteredData = data.filter((item) =>
//     item.title.toLowerCase().includes(filter.toLowerCase())
//   );

//   const visibleData = showAll ? filteredData : filteredData.slice(0, 5);

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     if (result.type === "CARD") {
//       const updatedCards = Array.from(cards);
//       const [movedCard] = updatedCards.splice(result.source.index, 1);
//       updatedCards.splice(result.destination.index, 0, movedCard);
//       setCards(updatedCards);
//     }

//     if (result.type === "ROW") {
//       const items = Array.from(data);
//       const [reorderedItem] = items.splice(result.source.index, 1);
//       items.splice(result.destination.index, 0, reorderedItem);
//       setData(items);
//     }
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom" as const, // Changed from "top" to "bottom"
//       },
//       title: {
//         display: true,
//         text: "Stock Report",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           drawBorder: false, // No Y-axis border
//           display: true, // Show horizontal grid lines
//         },
//       },
//       x: {
//         grid: {
//           display: false, // No vertical grid lines
//           drawBorder: true, // Show X-axis border
//         },
//       },
//     },
//   };

//   return (
//     <div className="flex flex-col gap-4 py-4">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="cards" direction="horizontal" type="CARD">
//           {(provided) => (
//             <div
//               className="flex flex-col lg:flex-row gap-4"
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//             >
//               {cards.map((cardId, index) => (
//                 <Draggable key={cardId} draggableId={cardId} index={index}>
//                   {(provided) => (
//                     <div
//                       className="flex-1 bg-white dark:bg-[#312c4a] p-4 rounded-xl shadow-md"
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       {cardId === "top-selling" ? (
//                         <>
//                           <div className="flex justify-between items-center mb-4">
//                             <h1 className="text-lg font-semibold sm:text-base md:text-lg lg:text-xl">
//                               Top Selling
//                             </h1>
//                             {filteredData.length > 6 && (
//                               <button
//                                 onClick={() => setShowAll(!showAll)}
//                                 className="text-black dark:text-white text-sm font-medium"
//                               >
//                                 {showAll ? "Show Less ←" : "View All →"}
//                               </button>
//                             )}
//                           </div>

//                           <div className="overflow-y-auto max-h-[300px]">
//                             <Droppable droppableId="table" type="ROW">
//                               {(provided) => (
//                                 <table
//                                   className="w-full text-sm sm:text-xs md:text-sm lg:text-base"
//                                   ref={provided.innerRef}
//                                   {...provided.droppableProps}
//                                 >
//                                   <thead className="sticky top-0 z-10 bg-[#0A3A66] text-white">
//                                     <tr>
//                                       <th className="p-2 text-left">Items</th>
//                                       <th className="p-2">Price</th>
//                                       <th className="p-2">Discount</th>
//                                       <th className="p-2">Sold</th>
//                                       <th className="p-2">Total Orders</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {visibleData.map((row, rowIndex) => (
//                                       <Draggable
//                                         key={row.title + rowIndex}
//                                         draggableId={row.title + rowIndex}
//                                         index={rowIndex}
//                                       >
//                                         {(provided, snapshot) => (
//                                           <tr
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             className={`text-center hover:text-gray-900 ${
//                                               snapshot.isDragging
//                                                 ? "bg-[#00A9B4]/30 text-gray-900"
//                                                 : "hover:bg-[#00A9B4]/30 dark:hover:text-white hover:text-gray-900"
//                                             }`}
//                                           >
//                                             <td className="p-1 text-left">
//                                               <div className="flex items-center gap-2">
//                                                 <Image
//                                                   src={
//                                                     row.image ||
//                                                     "./image/blue_tshirt.png"
//                                                   }
//                                                   alt={
//                                                     row.description || "Image"
//                                                   }
//                                                   width={20}
//                                                   height={20}
//                                                 />
//                                                 <div className="flex flex-col text-left">
//                                                   <span>{row.title}</span>
//                                                   <span className="text-gray-400 text-xs">
//                                                     Fashion
//                                                   </span>
//                                                 </div>
//                                               </div>
//                                             </td>
//                                             <td className="p-2">{row.price}</td>
//                                             <td className="p-2">
//                                               {row.discount}
//                                             </td>
//                                             <td className="p-2">{row.sold}</td>
//                                             <td className="p-2">
//                                               {row.totalOrder}
//                                             </td>
//                                           </tr>
//                                         )}
//                                       </Draggable>
//                                     ))}
//                                     {provided.placeholder}
//                                   </tbody>
//                                 </table>
//                               )}
//                             </Droppable>
//                           </div>
//                         </>
//                       ) : (
//                         <div>
//                           <div className="">
//                             <h1 className="text-lg font-semibold pb-2">
//                               Stock Report
//                             </h1>
//                             <div className="h-[280px]">
//                               <Bar
//                                 data={{
//                                   labels: sellData.map((item) => item.title),
//                                   datasets: [
//                                     {
//                                       label: "Sold",
//                                       data: sellData.map((item) => item.sold),
//                                       backgroundColor: "rgba(0, 169, 180, 0.5)",
//                                       borderColor: "rgba(0, 169, 180, 1)",
//                                       borderWidth: 1,
//                                     },
//                                     {
//                                       label: "Total Orders",
//                                       data: sellData.map(
//                                         (item) => item.totalOrder
//                                       ),
//                                       backgroundColor: "#0A3A66/70",
//                                       borderColor: "rgba(10, 58, 102, 1)",
//                                       borderWidth: 1,
//                                     },
//                                   ],
//                                 }}
//                                 options={options}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };

// export default TopSelling;

"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useParams } from "next/navigation";
import { Locale, isValidLocale } from "@/i18n/routing";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SellItem {
  id: number;
  title: string;
  description?: string;
  image: string;
  price: number;
  discount: string;
  sold: number;
  totalOrder: number;
}

interface TopSellingTranslations {
  title: string;
  stockReportTitle: string;
  viewAllLabel: string;
  showLessLabel: string;
  itemsLabel: string;
  priceLabel: string;
  discountLabel: string;
  soldLabel: string;
  totalOrdersLabel: string;
  categoryLabel: string;
  data: SellItem[];
}

interface TranslationMessages {
  topSelling?: TopSellingTranslations;
  [key: string]: unknown;
}

const fallbackSellData: SellItem[] = [
  // ... your fallback data here (omitted for brevity)
];

const TopSelling = () => {
  const params = useParams();
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [t, setT] = useState<TranslationMessages>({});
  const [data, setData] = useState<SellItem[]>(fallbackSellData);
  const [filter] = useState<string>(""); // added setter if you want to add filter input later
  const [showAll, setShowAll] = useState(false);
  const [cards, setCards] = useState(["top-selling", "stock-report"]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localeFromParams = params.lang as Locale;
    let locale: Locale = "en";

    if (isValidLocale(localeFromParams)) {
      locale = localeFromParams;
    } else if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("preferredLocale") as Locale;
      if (isValidLocale(storedLocale)) {
        locale = storedLocale;
      }
    }

    setCurrentLocale(locale);

    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLocale", locale);
    }
  }, [params.lang]);

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        const msgs = await import(
          `@/i18n/messages/${currentLocale}.json`
        ).catch(() => {
          throw new Error(`Failed to load ${currentLocale}.json`);
        });

        setT(msgs.default);

        const topSelling = msgs.default.topSelling;
        if (topSelling?.data && Array.isArray(topSelling.data)) {
          setData(topSelling.data);
        } else {
          console.warn(
            `TopSelling data not found in ${currentLocale}.json, using fallback`
          );
          setData(fallbackSellData);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading translations or data:", err);
        setT({});
        setData(fallbackSellData);
        setError("Failed to load top selling data");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [currentLocale]);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  const visibleData = showAll ? filteredData : filteredData.slice(0, 5);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.type === "CARD") {
      const updatedCards = Array.from(cards);
      const [movedCard] = updatedCards.splice(result.source.index, 1);
      updatedCards.splice(result.destination.index, 0, movedCard);
      setCards(updatedCards);
    }

    if (result.type === "ROW") {
      const items = Array.from(data);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setData(items);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t.topSelling?.stockReportTitle || "Stock Report",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: true,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="bg-white dark:bg-[#312c4a] rounded-xl p-4 flex items-center justify-center">
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="bg-white dark:bg-[#312c4a] rounded-xl p-4 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Optional: Add filter input if you want */}
      {/* <input
        type="text"
        placeholder="Search items..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded border"
      /> */}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards" direction="horizontal" type="CARD">
          {(provided) => (
            <div
              className="flex flex-col lg:flex-row gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((cardId, index) => (
                <Draggable key={cardId} draggableId={cardId} index={index}>
                  {(provided) => (
                    <div
                      className="flex-1 bg-white dark:bg-[#312c4a] p-4 rounded-xl shadow-md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {cardId === "top-selling" ? (
                        <>
                          <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-semibold sm:text-base md:text-lg lg:text-xl">
                              {t.topSelling?.title || "Top Selling"}
                            </h1>
                            {filteredData.length > 5 && (
                              <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-black dark:text-white text-sm font-medium"
                              >
                                {showAll
                                  ? t.topSelling?.showLessLabel || "Show Less ←"
                                  : t.topSelling?.viewAllLabel || "View All →"}
                              </button>
                            )}
                          </div>

                          <div className="overflow-y-auto  max-w-full">
                            <Droppable droppableId="table" type="ROW">
                              {(provided) => (
                                <table
                                  className="w-full text-sm sm:text-xs md:text-sm lg:text-base"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <thead className="sticky top-0 z-10 bg-[#0A3A66] text-white">
                                    <tr>
                                      <th className="p-2 text-left">
                                        {t.topSelling?.itemsLabel || "Items"}
                                      </th>
                                      <th className="p-2">
                                        {t.topSelling?.priceLabel || "Price"}
                                      </th>
                                      <th className="p-2">
                                        {t.topSelling?.discountLabel ||
                                          "Discount"}
                                      </th>
                                      <th className="p-2">
                                        {t.topSelling?.soldLabel || "Sold"}
                                      </th>
                                      <th className="p-2">
                                        {t.topSelling?.totalOrdersLabel ||
                                          "Total Orders"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {visibleData.map((row, rowIndex) => (
                                      <Draggable
                                        key={row.id}
                                        draggableId={String(row.id)}
                                        index={rowIndex}
                                      >
                                        {(provided, snapshot) => (
                                          <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`text-center hover:text-gray-900 ${
                                              snapshot.isDragging
                                                ? "bg-[#00A9B4]/30 text-gray-900"
                                                : "hover:bg-[#00A9B4]/30 dark:hover:text-white hover:text-gray-900"
                                            }`}
                                          >
                                            <td className="p-1 text-left">
                                              <div className="flex items-center gap-2">
                                                <Image
                                                  src={
                                                    row.image ||
                                                    "/image/blue_tshirt.png"
                                                  }
                                                  alt={
                                                    row.description || "Image"
                                                  }
                                                  width={20}
                                                  height={20}
                                                  onError={(e) => {
                                                    e.currentTarget.src =
                                                      "/image/blue_tshirt.png";
                                                  }}
                                                />
                                                <div className="flex flex-col text-left">
                                                  <span>{row.title}</span>
                                                  <span className="text-gray-400 text-xs">
                                                    {t.topSelling
                                                      ?.categoryLabel ||
                                                      "Fashion"}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="p-2">{row.price}</td>
                                            <td className="p-2">
                                              {row.discount}
                                            </td>
                                            <td className="p-2">{row.sold}</td>
                                            <td className="p-2">
                                              {row.totalOrder}
                                            </td>
                                          </tr>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </tbody>
                                </table>
                              )}
                            </Droppable>
                          </div>
                        </>
                      ) : (
                        <div className="max-w-full">
                          <h1 className="text-lg font-semibold pb-2">
                            {t.topSelling?.stockReportTitle || "Stock Report"}
                          </h1>
                          <div className="min-h-[280px]">
                            {data.length > 0 ? (
                              <Bar
                                data={{
                                  labels: data.map((item) => item.title),
                                  datasets: [
                                    {
                                      label: t.topSelling?.soldLabel || "Sold",
                                      data: data.map((item) => item.sold),
                                      backgroundColor: "rgba(0, 169, 180, 0.5)",
                                      borderColor: "rgba(0, 169, 180, 1)",
                                      borderWidth: 1,
                                    },
                                    {
                                      label:
                                        t.topSelling?.totalOrdersLabel ||
                                        "Total Orders",
                                      data: data.map((item) => item.totalOrder),
                                      backgroundColor: "rgba(10, 58, 102, 0.7)",
                                      borderColor: "rgba(10, 58, 102, 1)",
                                      borderWidth: 1,
                                    },
                                  ],
                                }}
                                options={options}
                              />
                            ) : (
                              <p className="text-red-500">
                                No data available for chart
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TopSelling;
