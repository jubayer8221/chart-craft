"use client";
import React, { useState } from "react";
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import Link from "next/link";
import { RiArrowDropDownLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Image from "next/image";
// import { div } from "framer-motion/client";
import { role } from "@/lib/data";

const LeftSide = () => {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-[47px] w-full"
        >
          {/* <span className='h-7 w-7 bg-zinc-200 rounded-lg'></span> */}
          {/* <span className="font-bold text-xl hidden md:flex"> */}
          <Image
            src="/logo.jpg"
            alt="Chart Crafter Logo"
            width={100}
            height={60}
          />
          {/* </span> */}
        </Link>

        {/* Added overflow-y-auto here to enable vertical scrolling */}
        <div className="flex flex-col space-y-2 md:px-6 overflow-y-auto">
          {SIDENAV_ITEMS.map((i, idx) => {
            return <MenuItem key={idx} i={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSide;

const MenuItem = ({i}: {i: SideNavItem}) =>{
  return (
    <div className="mt-4 text-sm">
      <div className="flex flex-col gap-2">
        <span>{i.title}</span>
        <div className="flex flex-col space-y-2">
          {
            i.items?.map((item, idx)=>{
              if(item.visible?.includes("admin")){
                return <SubMenuItem key={idx} item={item} />
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

const SubMenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg  w-full justify-between hover:bg-zinc-100 ${
              pathname.startsWith(item.path) ? "bg-zinc-100" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-4 flex">{item.title}</span>
            </div>
            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <RiArrowDropDownLine className="w-[24px] h-[24px]" />
            </div>
          </button>
          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${subItem.path === pathname ? "font-bold" : ""}`}
                  >
                    <div className="flex flex-row items-center space-x-4">
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row items-center p-2 rounded-lg hover:bg-zinc-100 w-full space-x-4 ${
            item.path === pathname ? "bg-zinc-100" : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-4 flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
