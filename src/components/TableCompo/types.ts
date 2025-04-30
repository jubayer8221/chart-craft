// This file contains the types for the Table component
export interface TableColumn {
  header: string;
  accessor: string;
}

export interface TableData {
  [key: string]: string | number;
}

// 👇 This makes sure TypeScript treats this file as a module
export {};
