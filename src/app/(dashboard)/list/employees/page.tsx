"use client";

import FormModal from "@/components/Home/FormModeal";
import Pagination from "@/components/Home/Pagination";
import Table from "@/components/Home/Table";
import TableSearch from "@/components/Home/TableSearch";
import { employeesData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
// import { FaPlus } from "react-icons/fa6";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import EmployeePopup from "@/components/Home/EmployeePopup";

type Employee = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  subjects?: string[];
  grade: number;
  classes: string[]; // <- FIXED HERE
  address: string;
  blood:string;
};


const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Employee ID",
    accessor: "EmployeeId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden lg:table-cell",
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

const EmployeesListPage = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const handleOpenPopup = (employee: Employee) =>{
        setSelectedEmployee(employee);
        setPopupOpen(true);
    }
    const handleClosePopup = () =>{
        setPopupOpen(false);
        setSelectedEmployee(null);
    }

  const renderRow = (item: Employee) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4 cursor-pointer " onClick={()=>handleOpenPopup(item)}>
          <Image
            src={item.photo}
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
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden lg:table-cell">{item.grade}</td>

      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/employees/${item.id}`}>
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
            <FormModal table="employee" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Employees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]">
              <span className="text-[14px] text-white">
                <IoFilterSharp />
              </span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]">
              <span className="text-[14px] text-white">
                <FaArrowDownWideShort />
              </span>
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              //   <span className="text-[14px]"><FaPlus /></span>
              // </button>
              <FormModal table="employee" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={employeesData} />
      {/* PAGINATION */}
      <Pagination />
      {
        isPopupOpen && selectedEmployee && (
            <EmployeePopup employee={selectedEmployee} onClose={handleClosePopup} />
        )
      }
    </div>
  );
};

export default  EmployeesListPage;
