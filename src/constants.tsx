import { SideNavItem } from "./types/types";

import { FiHome } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { LiaHireAHelper } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { TiThListOutline } from "react-icons/ti";
import { FaUsersCog } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

// export interface SideNavSubItem {
//   title?: string; // fallback title if no translation
//   titleKey?: string; // translation key for dynamic text
//   path: string;
//   icon?: React.ReactNode | null;
// }

// export interface SideNavItem {
//   title?: string; // fallback title if no translation
//   titleKey?: string; // translation key for dynamic text
//   path?: string;
//   visible: string[];
//   icon?: React.ReactNode | null;
//   submenu?: boolean;
//   subMenuItems?: SideNavSubItem[];
//   items?: SideNavItem[]; // for grouping items
// }

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    items: [
      {
        titleKey: "menu", // translation key for section title
        title: "MENU",
        visible: ["admin", "employee", "customer"],
        path: "",
      },
      {
        titleKey: "home",
        title: "Home",
        path: "/",
        icon: <FiHome className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        titleKey: "dashboard",
        title: "Dashboard",
        path: "",
        icon: <LuLayoutDashboard className="text-[16px]" />,
        visible: ["admin"],
        submenu: true,
        subMenuItems: [
          {
            titleKey: "admin",
            title: "Admin",
            path: "/admin",
            icon: <LuSettings className="w-[16px] h-[16px]" />,
          },
          {
            titleKey: "employee",
            title: "Employee",
            path: "/employee",
            icon: <FaUsersCog className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        titleKey: "employees",
        title: "Employees",
        path: "/list/employees",
        icon: <FaUsersCog className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee"],
      },
      {
        titleKey: "clients",
        title: "Clients",
        path: "/list/customers",
        icon: <FiUsers className="w-[16px] h-[16px]" />,
        visible: ["admin", "customer"],
      },
      {
        titleKey: "themes",
        title: "Themes",
        path: "/themes",
        icon: <TiThListOutline className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
        submenu: false,
        subMenuItems: [
          {
            titleKey: "configuration",
            title: "Configuration",
            path: "/training/configuration",
            icon: <LuSettings className="w-[16px] h-[16px]" />,
          },
          {
            titleKey: "report",
            title: "Report",
            path: "/page/buySellChart",
            icon: <TbReportSearch className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        titleKey: "messages",
        title: "Messages",
        path: "/messages",
        icon: <RiMessage3Line className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        titleKey: "report",
        title: "Report",
        path: "/page/buySellChart",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        titleKey: "events",
        title: "Events",
        path: "/page/event",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
      {
        titleKey: "announcements",
        title: "Announcements",
        path: "/page/announcements",
        icon: <TbReportSearch className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
    ],
  },
  {
    items: [
      {
        titleKey: "other",
        title: "OTHER",
        visible: ["admin", "employee", "customer"],
        path: "",
      },
      {
        titleKey: "settings",
        title: "Settings",
        path: "/settings",
        icon: <LuSettings className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
        submenu: true,
        subMenuItems: [
          {
            titleKey: "account",
            title: "Account",
            path: "/settings/account",
            icon: <MdOutlineManageAccounts className="w-[16px] h-[16px]" />,
          },
          {
            titleKey: "privacy",
            title: "Privacy",
            path: "/settings/privacy",
            icon: <MdOutlinePrivacyTip className="w-[16px] h-[16px]" />,
          },
          {
            titleKey: "More Settings",
            title: "More Settings",
            path: "/settings",
            icon: <MdOutlinePrivacyTip className="w-[16px] h-[16px]" />,
          },
        ],
      },
      {
        titleKey: "help",
        title: "Help",
        path: "/page/help",
        icon: <LiaHireAHelper className="w-[16px] h-[16px]" />,
        visible: ["admin", "employee", "customer"],
      },
    ],
  },
];
