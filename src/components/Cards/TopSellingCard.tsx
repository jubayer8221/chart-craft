import React from "react";

const TopSellingCard = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold">Top Selling</h1>
      <div className="text-sm text-gray-600 mt-2">
        {/* Replace this with your draggable table */}
        <p>Blue T-shirt — $100 — Sold 300</p>
        <p>Red Hoodie — $150 — Sold 200</p>
      </div>
    </div>
  );
};

export default TopSellingCard;
