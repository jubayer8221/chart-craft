"use client";

import { ReactNode, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
// import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
// import { RiDeleteBin6Line } from "react-icons/ri";

const FormModal =<T, >({
  table,
  type,
  // data,
  id,
}: {
  table:
    | "employee"
    | "customar";
  type: "create" | "view" | "delete";
  data?: T[];
  // data to be passed to the form
  // data?: any; // data to be passed to the form
  id?: number;
  children?: ReactNode;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#0A3A66]"
      : "bg-[#0A3A66]";

  const [open, setOpen] = useState(false);
  //   dynamic icon mapping
  const iconMap = {
    create: <FaPlus className="text-[14px] text-white" />,
    delete: <FaTrash className="text-[14px] text-white" />,
  };

  const Form = () => {
    if(type === "delete" && id){
      return (
        <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you wnt to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
      )
    }else if (type === "view"){
      return <div className="p-4"></div>
    }else{
      return "Create or update form";
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {type === "view" ? null : iconMap[type]}
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 z-50 flex items-center justify-center">
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
