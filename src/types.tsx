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

export type Employee = {
  id: number;
  teacherId: string;
  name: string;
  email?: string; // Optional (string | undefined)
  photo: string;
  phone?: string;
  grade: number;
  subjects?: string[];
  classes: string[];
  address: string;
  blood: string;
};

export type Customar = {
  id: number; // Use number to match CustomarListPage
  studentId: string;
  name: string;
  email?: string; // Optional to match CustomarListPage
  photo: string;
  phone?: string; // Optional to match CustomarListPage
  grade: number;
  class: string;
  address: string;
  blood: string;
};

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartType {
  id: string;
  title: string;
  type: "bar" | "line" | "pie";
  data: ChartData[];
  color: string;
}
