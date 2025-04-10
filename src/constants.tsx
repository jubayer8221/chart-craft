import { SideNavItem } from "./types";

import { FiHome } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { LiaHireAHelper } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { MdOutlineSchool } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { MdElectricBolt } from "react-icons/md";
import { SiWikibooks } from "react-icons/si";
import { LuShoppingBasket } from "react-icons/lu";
import { MdOutlineToys } from "react-icons/md";
import { GiScrollUnfurled } from "react-icons/gi";
import { GiClothesline } from "react-icons/gi";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    // submenu: true,
    icon: <FiHome className="w-[24px] h-[24px]" />,
  },
  {
    title: "Electronics",
    path: "/electronics",
    // submenu: true,
    icon: <MdElectricBolt className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/electronics/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/electronics/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Clothings",
    path: "/clothings",
    // submenu: true,
    icon: <GiClothesline className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/clothings/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/clothings/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Furnitures",
    path: "/furnitures",
    // submenu: true,
    icon: <GiScrollUnfurled className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/furnitures/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/furnitures/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Toys",
    path: "/toys",
    // submenu: true,
    icon: <MdOutlineToys className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/toys/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/toys/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Books",
    path: "/books",
    // submenu: true,
    icon: <SiWikibooks className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/books/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/books/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },

  {
    title: "Groceries",
    path: "/groceries",
    // submenu: true,
    icon: <LuShoppingBasket className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/groceries/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Buy & Sell Report",
        path: "/groceries/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },

  {
    title: "Training",
    path: "/training",
    icon: <MdOutlineSchool className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Configuration",
        path: "/training/configuration",
        icon: <LuSettings className="w-[24px] h-[24px]" />,
      },
      {
        title: "Report",
        path: "/training/report",
        icon: <TbReportSearch className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Messages",
    path: "/messages",
    // submenu: true,
    icon: <RiMessage3Line className="w-[24px] h-[24px]" />,
  },
  {
    title: "Report",
    path: "/training/report",
    icon: <TbReportSearch className="w-[24px] h-[24px]" />,
  },

  {
    title: "Settings",
    path: "/settings",
    icon: <LuSettings className="w-[24px] h-[24px]" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Account",
        path: "/settings/account",
        icon: <MdOutlineManageAccounts className="w-[24px] h-[24px]" />,
      },
      {
        title: "Privacy",
        path: "/settings/privacy",
        icon: <MdOutlinePrivacyTip className="w-[24px] h-[24px]" />,
      },
    ],
  },
  {
    title: "Help",
    // submenu: true,
    path: "/help",
    icon: <LiaHireAHelper className="w-[24px] h-[24px]" />,
  },
];
