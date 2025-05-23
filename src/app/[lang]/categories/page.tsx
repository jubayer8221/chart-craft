// // "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Locale, isValidLocale } from "@/i18n/routing";

// // import BuySellChart from "./components/buySellChart/BuySellChart";

// const categories = [
//   { id: 1, name: "Electronics" },
//   { id: 2, name: "Clothing" },
//   { id: 3, name: "Books" },
//   { id: 4, name: "Furniture" },
//   { id: 5, name: "Toys" },
//   { id: 6, name: "Groceries" },
// ];

// //import LeftSide from "@/components/Navbar/LeftSide";
// export default function Home() {
//   const params = useParams();
//   const id = params.id as string;
//   const currentLocaleCode = (params.lang as Locale) || "en";
//   const currentLocale = isValidLocale(currentLocaleCode)
//     ? currentLocaleCode
//     : "en";

//   const [t, setT] = useState<Messages>({});
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

//   return (
//     <main className="p-8">
//       <h1 className="text-3xl font-bold pt-5 mb-6 text-center ">
//         Category Grid
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
//         {categories.map((cat) => (
//           <div
//             key={cat.id}
//             className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
//           >
//             <h2 className="text-xl font-semibold">{cat.name}</h2>
//             <Link href={`/category/${cat.id}`}>
//               <button className="mt-4 bg-[#52796f] text-white px-4 py-2 rounded transform transition-transform active:scale-95">
//                 View More
//               </button>
//             </Link>
//           </div>
//         ))}
//       </div>
//       {/* <BuySellChart></BuySellChart> */}
//     </main>
//   );
// }
