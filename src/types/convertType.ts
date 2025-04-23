export interface ParsedRow {
    [key: string]: string | number;
  }
  
  export interface DataState {
    data: ParsedRow[];
  }