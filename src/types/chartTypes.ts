export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface ChartCardProps {
  id: string;
  title?: string;
  type: ChartType;
  data: ChartData;
  editable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onEdit?: (id: string, newData: ChartData) => void;
  onExport?: (id: string, format: 'csv' | 'image' | 'pdf') => void;
  onSelect?: (id: string, selected: boolean) => void;
}

// In types/chartTypes.ts
export interface ChartCardComponentProps extends ChartCardProps {
    onSelect?: (id: string, selected: boolean) => void;
    onEdit?: (id: string, data: ChartCardProps["data"]) => void;
    onExport?: (id: string, format: "csv" | "image" | "pdf") => void;
  }
  