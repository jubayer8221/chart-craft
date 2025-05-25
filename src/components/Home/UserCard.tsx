// import React from "react";

// const UserCard = ({ type }: { type: string }) => {
//   return (
//     <div className="rounded-xl odd:bg-[#0A3A66] dark:odd:bg-[#312c4a] even:bg-[#00A9B4] dark:even:bg-[#685e74] text-white p-4 flex-1 min-w-[130px]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] bg-white dark:bg-[#685e74] px-2 py-1 rounded-full text-green-600 dark:text-white">
//           2024/25
//         </span>
//       </div>
//       <h1 className="text-2xl font-semibold my-4">1,224</h1>
//       <h1 className="capitalize text-sm font-medium text-zinc-">{type}</h1>
//     </div>
//   );
// };

// export default UserCard;

"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

interface UserCardProps {
  type: string;
  count: number;
  year: string;
  id: number;
}

const UserCard: React.FC<UserCardProps> = ({ type, count, year }) => {
  return (
    <div className="rounded-xl odd:bg-[#0A3A66] dark:odd:bg-[#312c4a] even:bg-[#00A9B4] dark:even:bg-[#685e74] text-white p-4 flex-1 min-w-[130px]">
      <div className=" items-center justify-between">
        <span className="text-[10px] bg-white dark:bg-[#685e74] px-2 py-1 rounded-full text-green-600 dark:text-white">
          {year}
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
      <h1 className="capitalize text-sm font-medium">{type}</h1>
    </div>
  );
};

const UserCardsList: React.FC = () => {
  const pathname = usePathname() || "/";
  const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : locales[0];

  const [userCard, setUserCard] = useState<{ userCard: UserCardProps[] }>({
    userCard: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setUserCard(msgs);
      } catch (error) {
        console.error("Failed to load user card data:", error);
        setUserCard({ userCard: [] });
      }
    })();
  }, [currentLocale]);

  if (!userCard.userCard.length) return <div>Loading...</div>;

  return (
    <div className="flex w-full gap-4">
      {userCard.userCard.map((user) => (
        <UserCard
          key={user.id} // Use the unique ID
          id={user.id}
          type={user.type}
          count={user.count}
          year={user.year}
        />
      ))}
    </div>
  );
};

export default UserCardsList;

// "use client";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { locales, Locale, isValidLocale } from "@/i18n/routing";

// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "react-beautiful-dnd";

// interface UserCardProps {
//   type: string;
//   count: number;
//   year: string;
// }

// const UserCard: React.FC<UserCardProps> = ({ type, count, year }) => {
//   return (
//     <div className="rounded-xl odd:bg-[#0A3A66] dark:odd:bg-[#312c4a] even:bg-[#00A9B4] dark:even:bg-[#685e74] text-white p-4 flex-1 min-w-[130px]">
//       <div className="items-center justify-between">
//         <span className="text-[10px] bg-white dark:bg-[#685e74] px-2 py-1 rounded-full text-green-600 dark:text-white">
//           {year}
//         </span>
//       </div>
//       <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
//       <h1 className="capitalize text-sm font-medium">{type}</h1>
//     </div>
//   );
// };

// const UserCardsList: React.FC = () => {
//   const pathname = usePathname() || "/";
//   const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
//   const currentLocale = isValidLocale(currentLocaleCode)
//     ? currentLocaleCode
//     : locales[0];

//   const [cards, setCards] = useState<UserCardProps[]>([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
//           .default;
//         setCards(msgs.userCard);
//       } catch (error) {
//         console.error("Failed to load user card data:", error);
//         setCards([]);
//       }
//     })();
//   }, [currentLocale]);

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const updatedCards = Array.from(cards);
//     const [movedCard] = updatedCards.splice(result.source.index, 1);
//     updatedCards.splice(result.destination.index, 0, movedCard);

//     setCards(updatedCards);
//   };

//   if (!cards.length) return <div>Loading...</div>;

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Droppable
//         droppableId="dashboard-cards"
//         direction="horizontal"
//         type="CARD"
//       >
//         {(provided) => (
//           <div
//             className="flex w-full gap-4"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {cards.map((user, index) => (
//               <Draggable key={user.type} draggableId={user.type} index={index}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                   >
//                     <UserCard
//                       type={user.type}
//                       count={user.count}
//                       year={user.year}
//                     />
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

// export default UserCardsList;
