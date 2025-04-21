"use client";

import FormModal from "@/components/Home/FormModeal";
import Pagination from "@/components/Home/Pagination";
import Table from "@/components/Home/Table";
// import TableSearch from "@/components/Home/TableSearch";
import { customarsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
// import { FaPlus } from "react-icons/fa6";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import CustomarPopup from "@/components/Home/CustomarPopup";

import { FaArrowUpShortWide } from "react-icons/fa6";
import CreateCustomarPopup from "@/components/Home/CreateCustomarPopup";

type Customar = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
  blood: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Customar ID",
    accessor: "customarId",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CustomarListPage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCustomar, setSelectedCustomar] = useState<Customar | null>(
    null
  );
  const [isCreatePopup, setCreatePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // edit
  const [customars, setCustomars] = useState<Customar[]>([]);

  // console.log("locaddlsdf======: ", customars)
  useEffect(() => {
    const stored = localStorage.getItem("customarsData");
    // console.log("localhost stored", stored)
    if (stored) {
      setCustomars(JSON.parse(stored));
    } else {
      setCustomars(customarsData);
    }
  }, []);

  //create new data handle
  const handleAddCustomar = (newCustomar: Customar)=>{
    const updatedCustomars = [...customars, newCustomar];
    setCustomars(updatedCustomars);
    localStorage.setItem("customarsData", JSON.stringify(updatedCustomars));
  }

  const handleOpenPopup = (customar: Customar) => {
    setSelectedCustomar(customar);
    setPopupOpen(true);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedCustomar(null);
    setCreatePopup(false)
  };

  const handleCreatePopup = () =>{
    setCreatePopup(true);
  }

  // search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
  };

  // filter
  const handleFilter = () => {
    alert("Add your filter logic here!");
  };

  // sort by customaerID
  const handleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
  };

  // filter and sort data
  const filteredData = customars.filter((cus) =>
    cus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortDirection) return 0;
    const comparison = a.studentId.localeCompare(b.studentId);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const renderRow = (item: Customar) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td
        className="flex items-center gap-4 p-4 cursor-pointer "
        onClick={() => handleOpenPopup(item)}
      >
        <Image
          src={
            item.photo?.startsWith("data:image") ||
            item.photo?.startsWith("http")
              ? item.photo
              : "/assets/default-avatar.png"
          }
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-700">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/customers/edit/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#00A9B4]">
              {/* <Image src="/assets/view.png" alt="" width={16} height={16} /> */}
              <span className="text-4 text-white">
                <FaRegEdit />
              </span>
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]">
            //   <Image src="/assets/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="customar" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Customars</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* search  */}
          <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-md ring-[1.5px] ring-gray-300 px-2">
            <Image src="/assets/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
            />
            {showSuggestions && searchTerm && (
              <ul className="absolute w-full top-10 left-0 z-10 rounded-md bg-white border border-gray-300 max-h-[100px] overflow-y-auto">
                {filteredData.map((cu) => (
                  <li
                    key={cu.id}
                    className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                    onClick={() => handleSuggestionClick(cu.name)}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={cu.photo}
                        alt={cu.name}
                        width={40}
                        height={40}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{cu.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-4 self-end">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]"
              onClick={handleFilter}
            >
              <span className="text-[14px] text-white">
                <IoFilterSharp />
              </span>
            </button>
            <button
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]"
            >
              {sortDirection === "asc" ? (
                <span className="text-[14px] text-white">
                  <FaArrowDownWideShort />
                </span>
              ) : (
                <span className="text-[14px] text-white">
                  <FaArrowUpShortWide />
                </span>
              )}
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              //   <span className="text-[14px]"><FaPlus /></span>
              // </button>
               <button onClick={()=>handleCreatePopup()} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0A3A66]" ><FaPlus className="text-[14px] text-white" /></button>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={sortedData} />
      {/* PAGINATION */}
      <Pagination />
      {isPopupOpen && selectedCustomar && (
        <CustomarPopup customar={selectedCustomar} onClose={handleClosePopup} />
      )}

      {
        isCreatePopup && (
          <CreateCustomarPopup onAddCustomar={handleAddCustomar} onClose={handleClosePopup}/>
        )
      }
    </div>
  );
};

export default CustomarListPage;
