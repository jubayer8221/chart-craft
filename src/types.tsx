import { JSX } from "react";

export interface SideNavItem {
    title: string;
    path?: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItems?: SideNavItem[];
    items?: SideNavItem[];
    visible?: string[];
  }