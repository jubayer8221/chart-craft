
import { SideNavItem } from "./types";

import { FiHome } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { LiaHireAHelper } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { MdOutlineSchool } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";


export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Home',
        path: '/',
        // submenu: true,
        icon: <FiHome className="w-[24px] h-[24px]"/>
    },
    {
        title: 'Training',
        path: '/training',
        icon: <MdOutlineSchool className="w-[24px] h-[24px]" />,
        submenu: true,
        subMenuItems:[
            {title: "Configuration", path: '/training/configuration', icon: <LuSettings className="w-[24px] h-[24px]" />},
            {title: "Report", path: '/training/report', icon: <TbReportSearch className="w-[24px] h-[24px]" />},
        ],
    },
    {
        title: 'Messages',
        path: '/messages',
        // submenu: true,
        icon: <RiMessage3Line className="w-[24px] h-[24px]" />,
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <LuSettings className="w-[24px] h-[24px]" />,
        submenu: true,
        subMenuItems:[
            {title: "Account", path: '/settings/account', icon: <MdOutlineManageAccounts className="w-[24px] h-[24px]" />},
            {title: "Privacy", path: '/settings/privacy', icon: <MdOutlinePrivacyTip className="w-[24px] h-[24px]" />},
        ],
    },
    {
        title: 'Help',
        // submenu: true,
        path: '/help',
        icon: <LiaHireAHelper className="w-[24px] h-[24px]" />
    }
]