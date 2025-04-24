"use client";
import React, { JSX } from "react";
import { ReactNode, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import CustomarForm from "./forms/CustomarForm";
import EmployeeForm from "./forms/EmployeeForm";

const forms: {
  [key: string]: (type: "create") => JSX.Element;
} = {
  employee: (type) => <EmployeeForm type={type} />,
  customar: (type) => <CustomarForm type={type} />,
};

const FormModal = <T,>({
  table,
  type,
  id,
  onDelete,
}: {
  table: "employee" | "customar";
  type: "create" | "delete";
  data?: T[];
  id?: number;
  onDelete?: (id: number) => void;
  children?: ReactNode;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";

  const [open, setOpen] = useState(false);
  const iconMap = {
    create: <FaPlus className="text-[14px] text-white" />,
    delete: <FaTrash className="text-[14px] text-white" />,
  };

  const Form = () => {
    return type === "delete" && id ? (
      <form
        action=""
        className="p-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onDelete?.(id);
          setOpen(false);
        }}
      >
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "create" ? (
      forms[table](type)
    ) : (
      "Not found data?"
    );
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full bg-[#0A3A66]`}
        onClick={() => setOpen(true)}
      >
        {iconMap[type]}
      </button>
      {open && (
        <div
          className="w-screen h-screen fixed left-0 top-0 z-50 flex items-center justify-center bg-black/50" // Changed 'absolute' to 'fixed'
          aria-hidden="true"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[50%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <RxCross2 className="text-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;