"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaArrowUpShortWide } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

import FormModal from "@/components/Home/FormModeal";
import Pagination from "@/components/Home/Pagination";
import Table from "@/components/Home/Table";
import dynamic from "next/dynamic";

const EmployeePopup = dynamic(() => import("@/components/Home/EmployeePopup"), {
  ssr: false,
});
const CreateEmployeePopup = dynamic(
  () => import("@/components/Home/CreateEmployeePopup"),
  { ssr: false }
);

import { employeesData, role } from "@/lib/data";

type Employee = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  subjects?: string[];
  classes: string[];
  address: string;
  blood: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Employee ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  { header: "Grade", accessor: "grade", className: "hidden lg:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const EmployeesListPage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isCreatePopup, setCreatePopup] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of employees per page

  useEffect(() => {
    const stored = localStorage.getItem("employeesData");
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      setEmployees(employeesData);
    }
  }, []);

  const handleDeleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employeesData", JSON.stringify(updatedEmployees));
  };

  const handleOpenPopup = (employee: Employee) => {
    setSelectedEmployee(employee);
    setPopupOpen(true);
  };

  const handleCreatePopup = () => {
    setCreatePopup(true);
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employeesData", JSON.stringify(updatedEmployees));
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedEmployee(null);
    setCreatePopup(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSuggestionClick = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    setCurrentPage(1); // Reset to first page on suggestion click
  };

  const handleFilter = () => {
    alert("Add your filter logic here!");
  };

  const filteredData = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) =>
      prev && prev.key === key
        ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
    setCurrentPage(1); // Reset to first page on sort
  };

  const sortedData = [...filteredData].sort((a, b) => {
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
      return direction === "asc"
        ? aVal - (bVal as number)
        : (bVal as number) - aVal;
    }
    return 0;
  });

  // Calculate paginated data
  const totalItems = sortedData.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderRow = (item: Employee) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 dark:border-[#312c4a] even:bg-slate-50 dark:even:bg-gray-700 text-sm hover:bg-[#F1F0FF] dark:hover:bg-gray-600"
    >
      <td
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => handleOpenPopup(item)}
      >
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-700 dark:text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden lg:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/employees/edit/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#00A9B4] dark:bg-[#685e74]">
              <span className="text-white text-[14px]">
                <FaRegEdit />
              </span>
            </button>
          </Link>
          {role === "admin" && (
            <FormModal
              table="employee"
              type="delete"
              id={item.id}
              onDelete={handleDeleteEmployee}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md flex-1">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Employees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-md ring-[1.5px] ring-gray-300 dark:ring-[#897c8f] px-2">
            <Image
              src="/assets/search.png"
              alt="search"
              width={14}
              height={14}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name..."
              className="w-[200px] p-2 bg-transparent outline-none"
            />
            {showSuggestions && searchTerm && (
              <ul className="absolute top-10 left-0 bg-white dark:bg-[#463f59] shadow-lg border border-gray-300 dark:border-[#897c8f] w-full rounded-md z-10 max-h-40 overflow-y-auto text-sm">
                {filteredData.map((emp) => (
                  <li
                    key={emp.id}
                    onClick={() => handleSuggestionClick(emp.name)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={emp.photo}
                        alt={emp.name}
                        width={40}
                        height={40}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{emp.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sort & Filter Buttons */}
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={handleFilter}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66] dark:bg-[#000022] text-white"
            >
              <IoFilterSharp />
            </button>
            <button
              onClick={() => handleSort("name")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A3A66] dark:bg-[#000022] text-white"
            >
              {sortConfig?.direction === "desc" ? (
                <FaArrowUpShortWide />
              ) : (
                <FaArrowDownWideShort />
              )}
            </button>
            {role === "admin" && (
              <button
                onClick={() => handleCreatePopup()}
                className="w-7 h-7 flex items-center justify-center rounded-full dark:bg-[#000022] bg-[#0A3A66]"
              >
                <FaPlus className="text-[14px] text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={paginatedData} />

      {/* PAGINATION */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* POPUP */}
      {isPopupOpen && selectedEmployee && (
        <EmployeePopup employee={selectedEmployee} onClose={handleClosePopup} />
      )}

      {/* CREATE POPUP */}
      {isCreatePopup && (
        <CreateEmployeePopup
          onClose={handleClosePopup}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesListPage;
