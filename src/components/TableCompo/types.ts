export interface TableColumn {
    header: string;
    accessor: string;
  }
  
  export interface TableData {
    [key: string]: string | number;
  }
  