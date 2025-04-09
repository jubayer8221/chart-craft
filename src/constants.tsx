
import { SideNavItem } from "./types";

import { FiHome } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { LiaHireAHelper } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { GrProjects } from "react-icons/gr";


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
        icon: <GrProjects className="w-[24px] h-[24px]" />,
        submenu: true,
        subMenuItems:[
            {title: "Configuration", path: '/training/configuration'},
            {title: "Report", path: '/training/report'},
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
            {title: "Account", path: '/settings/account'},
            {title: "Privacy", path: '/settings/privacy'},
        ],
    },
    {
        title: 'Help',
        // submenu: true,
        path: '/help',
        icon: <LiaHireAHelper className="w-[24px] h-[24px]" />
    }
]