"use client";

// import data from "@/data/data";
import data from "../../data/data";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { TiEye } from "react-icons/ti";

const ZoneTable = () => {
  const [isOpenRow, setIsOpenRow] = useState({});
  const toggleOpen = (id) => {
    setIsOpenRow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const Randrow = ({ item, level = 0 }) => {
    const isOpen = isOpenRow[item.id] || false;
    return (
      <>
        <tr className="border-b border-gray-400 hover:bg-gray-100">
          <td
            className={`px-2 py-4 flex items-center gap-5 ${
              level ? "ml-2" : ""
            }`}
          >
            {/* <span className={`${level ? "ml-2" : ""}`}></span> */}
            {item.children && item.children.length > 0 ? (
              <button
                onClick={() => toggleOpen(item.id)}
                className=" text-white w-6 h-6 p-2 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer transition-transform transform active:scale-95"
              >
                {isOpen ? (
                  <LuMinus className="text-[20px]" />
                ) : (
                  <FaPlus className="text-[20px]" />
                )}
              </button>
            ) : (
              <VscDebugBreakpointLog className="text-4" />
            )}

            {item.name}
          </td>
          <td className="px-2 py-4">{item.borr}</td>
          <td className="px-2 py-4">{item.savings}</td>
          <td className="px-2 py-4">{item.savingsRatio}</td>
          <td className="px-2 py-4">{item.os}</td>
          <td className="px-2 py-4">{item.avgos}</td>
          <td className="px-2 py-4">{item.otr}</td>
          <td className="px-2 py-4">{item.totalcollection}</td>
          <td className="px-2 py-4">{item.serviceCharge}</td>
          <td className="px-2 py-4">{item.savingscollection}</td>
          <td className="px-2 py-4">{item.srratio}</td>
          <td className="px-2 py-4">{item.disbursement}</td>
          <td className="px-2 py-4">{item.cashandbank}</td>
          <td className="px-2 py-4">{item.overdue}</td>
          <td className="px-2 py-4">
            <Link href={`/page/childrenchart/${item.id}`}>
              <button className="w-6 h-6 p-1 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer transition-transform transform active:scale-95">
                <TiEye className="text-[20px] text-white" />
              </button>
            </Link>
          </td>
        </tr>
        {isOpen &&
          item.children &&
          item.children.map((child) => (
            <Randrow item={child} key={child.id} level={level + 1} />
          ))}
      </>
    );
  };

  return (
    <>
      <div className="my-2 py-2 bg-gray-100">
        <h1 className="text-2xl font-bold py-2">Zone Data</h1>

        <div className="overflow-x-auto bg-white rounded-md shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left text-sm">
                <th className="px-2 py-4">Operation Place</th>
                <th className="px-2 py-4">Borr / Br</th>
                <th className="px-2 py-4">Savings</th>
                <th className="px-2 py-4">Savings Ratio</th>
                <th className="px-2 py-4">OS</th>
                <th className="px-2 py-4">Avg. OS</th>
                <th className="px-2 py-4">OTR%</th>
                <th className="px-2 py-4">Total Collection</th>
                <th className="px-2 py-4">Service Charge</th>
                <th className="px-2 py-4">Savings RTN</th>
                <th className="px-2 py-4">SR Ratio</th>
                <th className="px-2 py-4">Disbursement</th>
                <th className="px-2 py-4">Cash & Bank</th>
                <th className="px-2 py-4">Overdue</th>
                <th className="px-2 py-4">View</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {data.map((item) => (
                <Randrow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ZoneTable;
