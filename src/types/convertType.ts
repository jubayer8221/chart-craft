export interface ParsedRow {
  [key: string]: string | number | null;
}

export interface DataState {
  data: ParsedRow[];
  searchTerm: string;
  filtered: ParsedRow[];
  isLoading: boolean;
  error: string | null;
  headerNames: Record<string, string>;
}