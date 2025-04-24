export interface ParsedRow {
  [key: string]: string | number | null;
}

export interface DataState {
    data: ParsedRow[];
}