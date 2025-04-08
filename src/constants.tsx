
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
        icon: <FiHome />
    },
    {
        title: 'Projects',
        path: '/projects',
        icon: <GrProjects />,
        submenu: true,
        subMenuItems:[
            {title: "All", path: '/projects'},
            {title: "Web Design", path: '/projects/web-design'},
            {title: "Graphic Design", path: '/projects/graphic-design'},
        ],
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <RiMessage3Line />,
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <LuSettings />,
        submenu: true,
        subMenuItems:[
            {title: "Account", path: '/settings/account'},
            {title: "Privacy", path: '/settings/privacy'},
        ],
    },
    {
        title: 'Help',
        path: '/help',
        icon: <LiaHireAHelper />
    }
]