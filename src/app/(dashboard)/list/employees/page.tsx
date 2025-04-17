"use client";

import FormModal from "@/components/Home/FormModeal";
import Pagination from "@/components/Home/Pagination";
import Table from "@/components/Home/Table";
import TableSearch from "@/components/Home/TableSearch";
import { employeesData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
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
  classes: string[];
  address: string;
  blood: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Employee ID",
    accessor: "teacherId", // Fixed to match actual data key
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: "asc" | "desc" } | null>(null);

  const handleOpenPopup = (employee: Employee) => {
    setSelectedEmployee(employee);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedEmployee(null);
  };

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) =>
      prev && prev.key === key
        ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sortedData = [...employeesData].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null || bVal == null) return 0;

    if (typeof aVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    if (typeof aVal === "number") {
      return direction === "asc" ? aVal - (bVal as number) : (bVal as number) - aVal;
    }

    return 0;
  });

  const renderRow = (item: Employee) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => handleOpenPopup(item)}>
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
          <Link href={`/list/employees/edit/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#00A9B4]">
              <span className="text-4 text-white">
                <FaRegEdit />
              </span>
            </button>
          </Link>
          {role === "admin" && (
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
            <button
              onClick={() => handleSort("name")} // You can change to any sortable field
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66]"
            >
              <span className="text-[14px] text-white">
                <FaArrowDownWideShort />
              </span>
            </button>
            {role === "admin" && (
              <FormModal table="employee" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={sortedData} />
      {/* PAGINATION */}
      <Pagination />
      {isPopupOpen && selectedEmployee && (
        <EmployeePopup employee={selectedEmployee} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default EmployeesListPage;
