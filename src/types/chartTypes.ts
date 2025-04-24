export type ChartType = 'bar' | 'line' | 'pie' | "doughnut" | "radar" | "polarArea" | "bubble" | "scatter";

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface StoreChart {
  id: string;
  title?: string;
  type: ChartType;
  data: ChartData;
  editable?: boolean;
  selectable?: boolean;
}

export interface ChartState {
  charts: StoreChart[];
  selectedChartIds: string[];
}

export interface ChartCardProps extends Omit<StoreChart, 'selectable'> {
  selected: boolean;
  onEdit: (id: string, data: ChartData) => void;
  onSelect: (id: string, selected: boolean) => void;
  onTypeChange: (id: string, type: ChartType) => void;
  onExport: (id: string, format: "csv" | "image" | "pdf") => void;
}