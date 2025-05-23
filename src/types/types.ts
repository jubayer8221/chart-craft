import React, { JSX } from "react";
import type { LayoutType, ScaleType } from "recharts/types/util/types";

// Sidebar navigation related types

export interface SideNavItem {
  titleKey?: string;               // Translation key (optional)
  title?: string;                  // Display title (optional)
  path?: string;                  // Navigation path (optional)
  icon?: JSX.Element | React.ReactNode | null;  // Icon component
  submenu?: boolean;              // Has submenu or not (optional)
  subMenuItems?: SideNavSubItem[];  // Submenu items (optional)
  items?: SideNavSubItem[];       // For grouped items (optional)
  visible?: string[];             // Roles or conditions for visibility (optional)
}

export interface SideNavSubItem {
  titleKey: string;               // Translation key
  title?: string;                 // Display title (optional)
  path: string;                  // Navigation path
  icon?: React.ReactNode | null; // Icon component (optional)
  visible?: string[];            // Roles or conditions for visibility (optional)
  submenu?: boolean;              // Has submenu or not (optional)
  subMenuItems?: SideNavSubItem[];  // Submenu items (optional)


}

// User-related types

export type Employee = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;    // Optional email
  photo: string;
  phone?: string;    // Optional phone number
  grade: number;
  subjects?: string[];
  classes: string[];
  address: string;
  blood: string;
  titleKey?: string; // Optional translation key (e.g. role or title)
};

export type Customar = {
  id: number;
  studentId: string;
  name: string;
  email?: string;    // Optional email
  photo: string;
  phone?: string;    // Optional phone number
  grade: number;
  class: string;
  address: string;
  blood: string;
  titleKey?: string; // Optional translation key (e.g. role or title)
};

// Chart and visualization types

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

export interface ParsedRow {
  [key: string]: string | number | null;
}

export interface ChartProps {
  data: ParsedRow[];
  initialChartType?: "bar" | "line" | "pie" | "area" | "scatter";
  theme?: "light" | "dark";
}

export interface ProcessedData {
  columns: string[];
  processedData: ParsedRow[];
  numericColumns: string[];
  nonNumericColumns: string[];
}

export interface PieDataEntry {
  name: string;
  value: number;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter";
  stacked?: boolean;
  horizontal?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export interface ExportState {
  exportFormat: "pdf" | "image" | null;
  exportRequested: boolean;
  selectedItems: string[];
  selectedExportOptions: string[];
}

export interface ChartComponentProps {
  data: ParsedRow[];
  margin: { top: number; right: number; left: number; bottom: number };
  layout?: LayoutType;
  xAxisProps?: {
    dataKey: string;
    angle: number;
    textAnchor: "middle" | "end";
    height: number;
    scale: ScaleType;
  };
  yAxisProps?: {
    scale: ScaleType;
  };
  valueColumns: string[];
  colors: Record<string, string>;
  defaultColors: string[];
  stacked?: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  showLegend: boolean;
}

export interface PieChartComponentProps {
  data: ParsedRow[];
  margin: { top: number; right: number; left: number; bottom: number };
  pieData: PieDataEntry[];
  valueColumns: string[];
  colors: Record<string, string>;
  defaultColors: string[];
  showTooltip: boolean;
  showLegend: boolean;
}
