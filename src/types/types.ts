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

import type { LayoutType, ScaleType } from "recharts/types/util/types";

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
