
"use client"

import FormModal from "@/components/Home/FormModeal";
import Pagination from "@/components/Home/Pagination";
import Table from "@/components/Home/Table";
import TableSearch from "@/components/Home/TableSearch";
import { customarsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
// import { FaPlus } from "react-icons/fa6";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import CustomarPopup from "@/components/Home/CustomarPopup";
import { useState } from "react";

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
  { header: "Info", accessor: "info" },
  {
    header: "Customer ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const customerListPage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
      const [selectedCustomar, setSelectedEmployee] = useState<Customar | null>(null);
  
      const handleOpenPopup = (employee: Customar) =>{
          setSelectedEmployee(employee);
          setPopupOpen(true);
      }
      const handleClosePopup = () =>{
          setPopupOpen(false);
          setSelectedEmployee(null);
      }

  const renderRow = (item: Customar) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
      >
        <td className="flex items-center gap-4 p-4" onClick={()=>handleOpenPopup(item)}>
          <Image
            src={item.photo || "/images/fallback-teacher.jpg"}
            alt={item.name || "Teacher photo"}
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
            onError={() =>
              console.error(`Image failed for ${item.name}: ${item.photo}`)
            }
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.studentId}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/customers/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA]">
                <Image
                  src="/assets/view.png"
                  alt="View teacher"
                  width={16}
                  height={16}
                />
              </button>
            </Link>
            {/* // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]">
              //   <Image src="/assets/delete.png" alt="Delete teacher" width={16} height={16} />
              // </button> */}
            <FormModal table="customar" type="delete" id={item.id} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Customars</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]">
            <span className="text-[14px] text-white"><IoFilterSharp /></span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]">
              <span className="text-[14px] text-white"><FaArrowDownWideShort /></span>
            </button>
            {
              role === "admin" && (
                <FormModal table="customar" type="create" />
              )
            }
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={customarsData} />
      {/* PAGINATION */}
      <Pagination />
      {
        isPopupOpen && selectedCustomar && (
            <CustomarPopup customar={selectedCustomar} onClose={handleClosePopup} />
        )
      }
    </div>
  );
};

export default customerListPage;
