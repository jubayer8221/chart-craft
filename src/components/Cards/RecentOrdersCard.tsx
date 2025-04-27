import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const RecentOrdersCard = () => {
  const [orders, setOrders] = useState([
    { id: 1, name: "Shirt", order: "1001", progress: "Delivered" },
    { id: 2, name: "Pants", order: "1002", progress: "In Transit" },
    { id: 3, name: "Shoes", order: "1003", progress: "Processing" },
    { id: 4, name: "Hat", order: "1004", progress: "Delivered" },
    { id: 5, name: "Jacket", order: "1005", progress: "Cancelled" },
    { id: 6, name: "Socks", order: "1006", progress: "Processing" },
    { id: 7, name: "Scarf", order: "1007", progress: "In Transit" },
    { id: 8, name: "Gloves", order: "1008", progress: "Delivered" },
    { id: 9, name: "Sweater", order: "1009", progress: "Cancelled" },
    { id: 10, name: "Belt", order: "1010", progress: "Processing" },
  ]);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.dataTransfer.setData("dragIndex", index.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    dropIndex: number
  ) => {
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
    if (dragIndex === dropIndex) return;

    const updatedOrders = [...orders];
    const [draggedOrder] = updatedOrders.splice(dragIndex, 1);
    updatedOrders.splice(dropIndex, 0, draggedOrder);

    setOrders(updatedOrders);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <h1 className="text-lg font-semibold pb-2 dark:text-white">Recent Orders</h1>
      <div className="overflow-x-auto">
        <div className="max-h-[260px] min-w-[300px] overflow-y-auto">
          <table className="text-sm text-gray-600 dark:text-white border-collapse border rounded border-gray-300 dark:border-gray-600 w-full">
            <thead>
              <tr className="justify-around dark:bg-[#0A3A66]">
                <th
                  className="border-gray-300 dark:border-gray-600 px-1 py-1 cursor-pointer"
                  onClick={() =>
                    setOrders([...orders].sort((a, b) => a.id - b.id))
                  }
                >
                  <span className="flex items-center justify-center gap-1 transition-transform duration-200 active:scale-90">
                    <span>No.</span>
                    {orders.every(
                      (order, i, arr) => i === 0 || arr[i - 1].id <= order.id
                    ) ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                </th>
                <th
                  className="border-gray-300 px-1 py-1 cursor-pointer text-center"
                  onClick={() =>
                    setOrders(
                      [...orders].sort((a, b) => a.name.localeCompare(b.name))
                    )
                  }
                >
                  <span className="flex items-center justify-center gap-1 transition-transform duration-200 active:scale-90">
                    <span>Name</span>
                    {orders.every(
                      (order, i, arr) =>
                        i === 0 || arr[i - 1].name <= order.name
                    ) ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                </th>
                <th
                  className="border-gray-300 dark:border-gray-500 px-1 py-1 cursor-pointer"
                  onClick={() =>
                    setOrders(
                      [...orders].sort((a, b) => a.order.localeCompare(b.order))
                    )
                  }
                >
                  <span className="flex items-center justify-center gap-1 transition-transform duration-200 active:scale-90">
                    <span>Order ID</span>
                    <span>
                      {orders.every(
                        (order, i, arr) =>
                          i === 0 || arr[i - 1].order <= order.order
                      ) ? (
                        <IoMdArrowDropup />
                      ) : (
                        <IoMdArrowDropdown />
                      )}
                    </span>
                  </span>
                </th>
                <th
                  className="border-gray-300 dark:border-gray-600 px-1 py-1 cursor-pointer"
                  onClick={() =>
                    setOrders(
                      [...orders].sort((a, b) =>
                        a.progress.localeCompare(b.progress)
                      )
                    )
                  }
                >
                  <span className="flex items-center justify-center gap-1 transition-transform duration-200 active:scale-90">
                    <span>Progress</span>
                    <span>
                      {orders.every(
                        (order, i, arr) =>
                          i === 0 || arr[i - 1].progress <= order.progress
                      ) ? (
                        <IoMdArrowDropup />
                      ) : (
                        <IoMdArrowDropdown />
                      )}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  className="cursor-move justify-around border border-gray-300 dark:border-gray-600"
                >
                  <td className="px-4 md:p-2 py-2">{order.id}</td>
                  <td className="px-4 md:p-2 py-2 ">{order.name}</td>
                  <td className="px-4 md:p-2 py-2">{order.order}</td>
                  <td className="px-4 md:p-2 py-2">{order.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersCard;
