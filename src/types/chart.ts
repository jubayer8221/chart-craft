
export interface ChartData {
  label: string;
  value: number;
}

export interface ChartType {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: ChartData[];
  color: string;
}