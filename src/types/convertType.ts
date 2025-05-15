export interface ParsedRow {
  [key: string]: string | number | null;
}

export interface DataState {
  data: ParsedRow[];
  searchTerm: string;
  filtered: ParsedRow[];
  isLoading: boolean;
  error: string | null;
  tableTitle: string; 
  headerNames: Record<string, string>;
  loadCount: number;
  currentRowOffset: number;
  totalRows: number;
}