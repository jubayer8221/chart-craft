import { SideNavItem } from "./types/types";

import { FiHome } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { LiaHireAHelper } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
// import { MdOutlineSchool } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { TiThListOutline } from "react-icons/ti";
// import { MdElectricBolt } from "react-icons/md";
// import { SiWikibooks } from "react-icons/si";
// import { LuShoppingBasket } from "react-icons/lu";
// import { MdOutlineToys } from "react-icons/md";
// import { GiScrollUnfurled } from "react-icons/gi";
// import { GiClothesline } from "react-icons/gi";
import { FaUsersCog } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        title: "Home",
        path: "/",
        icon: <FiHome className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LuLayoutDashboard className="text-[16px]" />,
        visible: ["admin"],
        submenu: true,
        subMenuItems: [
          {
            title: "Admin",
            path: "/admin",
            icon: <LuSettings className="w-[16px] h-[16px]" />,
          },
          {
            title: "Employee",
            path: "/employee",
            icon: <FaUsersCog className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        title: "Employees",
        path: "/list/employees",
        icon: <FaUsersCog className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee"],
      },
      {
        title: "Clients",
        path: "/list/customers",
        icon: <FiUsers className="w-[16px] h-[16px]" />,
        visible: ["admin", "customer"],
      },
      // {
      //   title: "Buy & Sell Report",
      //   path: "/page/buySellChart",
      //   // submenu: true,
      //   icon: <SiWikibooks className="w-[16px] h-[16px]" />,
      //   visible: ["admin"],
      // },

      {
        title: "Themes",
        path: "/themes",
        icon: <TiThListOutline className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
        submenu: false,
        subMenuItems: [
          {
            title: "Configuration",
            path: "/training/configuration",
            icon: <LuSettings className="w-[16px] h-[16px]" />,
          },
          {
            title: "Report",
            path: "/training/report",
            icon: <TbReportSearch className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        title: "Messages",
        path: "/messages",
        // submenu: true,
        icon: <RiMessage3Line className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        title: "Report",
        path: "/buySellChart",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        title: "Events",
        path: "/training/report",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        title: "Announcements",
        path: "/training/report",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: <LuSettings className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
        submenu: true,
        subMenuItems: [
          {
            title: "Account",
            path: "/settings/account",
            icon: <MdOutlineManageAccounts className="w-[16px] h-[16px]" />,
          },
          {
            title: "Privacy",
            path: "/settings/privacy",
            icon: <MdOutlinePrivacyTip className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        title: "Help",
        // submenu: true,
        path: "/help",
        icon: <LiaHireAHelper className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
    ],
  },
];
