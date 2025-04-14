import React, { useState } from "react";

const RecentOrdersCard = () => {
  const [orders, setOrders] = useState([
    { id: 1, name: "Shirt", order: "1001", progress: "Delivered" },
    { id: 2, name: "Pants", order: "1002", progress: "In Transit" },
    { id: 3, name: "Shoes", order: "1003", progress: "Processing" },
    { id: 4, name: "Hat", order: "1004", progress: "Delivered" },
    { id: 5, name: "Jacket", order: "1005", progress: "Cancelled" },
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
    <div>
      <h1 className="text-lg font-semibold">Recent Orders</h1>
      <div className="overflow-x-auto mt-2">
        <table className="text-sm text-gray-600 border-collapse border rounded border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border-gray-300 px-1 py-1">No.</th>
              <th className="border-gray-300 px-1 py-1">Name</th>
              <th className="border-gray-300 px-1 py-1">Order ID</th>
              <th className="border-gray-300 px-1 py-1">Progress</th>
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
                className="cursor-move border border-gray-300"
              >
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.name}</td>
                <td className="px-4 py-2">{order.order}</td>
                <td className="px-4 py-2">{order.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersCard;
