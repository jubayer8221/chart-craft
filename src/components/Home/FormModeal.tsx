"use client";

import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
// import { RiDeleteBin6Line } from "react-icons/ri";

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#0A3A66]"
      : type === "update"
      ? "bg-[#C3EBFA]"
      : "bg-[#0A3A66]";

  const [open, setOpen] = useState(false);
  //   dynamic icon mapping
  const iconMap = {
    create: <FaPlus className="text-[14px] text-white" />,
    update: <FiEdit className="text-[14px] text-white" />,
    delete: <FaTrash className="text-[14px] text-white" />,
  };

  const Form = () =>{
    return type === "delete" && id ? (
        <form action="" className="p-4 flex flex-col gap-4">
            <span className="text-center font-medium">All data will be lost. Are you sure you wnt to delete this {table}?</span>
            <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
        </form>
    ): (
        "Create or update form"
    )
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {iconMap[type]}
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[50%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer "
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
