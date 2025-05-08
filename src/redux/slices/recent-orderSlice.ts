// store/slices/tableSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  id: string;
  name: string;
  price: number;
  order: string;
  progress: string;
}

interface SortConfig {
  key: keyof Item;
  direction: "asc" | "desc";
}

export interface TableState {
  data: Item[];
  recentOrders: Item[];
  selectedRows: number[];
  sortConfig: SortConfig | null;
  progressFilter: string;
  visibleColumns: string[];
  darkMode: boolean;
  currentPage: number;
}

const initialState: TableState = {
  data: [],
  recentOrders: [],
  selectedRows: [],
  sortConfig: null,
  progressFilter: "",
  visibleColumns: ["id", "name", "order", "progress", "price"],
  darkMode: false,
  currentPage: 1,
};

const sortItems = (items: Item[], sortConfig: SortConfig | null): Item[] => {
    if (!sortConfig) return items;
    
    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
  
      return 0;
    });
};
  
const filterItems = (items: Item[], progressFilter: string): Item[] => {
    return progressFilter 
      ? items.filter(item => item.progress === progressFilter)
      : items;
  };

const recentOrderReducer = createSlice({
  name: "table",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Item[]>) {
      state.data = action.payload;
      },
      setSortConfig(state, action: PayloadAction<SortConfig | null>) {
        state.progressFilter = ""; // Reset filter when sorting
        state.sortConfig = action.payload;
        state.data = sortItems(state.data, action.payload);
      },
      
      setProgressFilter(state, action: PayloadAction<string>) {
        // Toggle filter if clicking the same one
        if (state.progressFilter === action.payload) {
          state.progressFilter = "";
        } else {
          state.sortConfig = null; // Reset sort when filtering
          state.progressFilter = action.payload;
        }
        state.data = filterItems(state.data, state.progressFilter);
      },
    setSelectedRows(state, action: PayloadAction<number[]>) {
      state.selectedRows = action.payload;
    },
    // setSortConfig(state, action: PayloadAction<SortConfig | null>) {
    //   state.sortConfig = action.payload;
    // },
    // setProgressFilter(state, action: PayloadAction<string>) {
    //   state.progressFilter = action.payload;
    // },
    setVisibleColumns(state, action: PayloadAction<string[]>) {
      state.visibleColumns = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    // Recent Orders Logic
    addRecentOrder(state, action: PayloadAction<Item>) {
      state.recentOrders.unshift(action.payload);
    },
    deleteRecentOrder(state, action: PayloadAction<string>) {
      state.recentOrders = state.recentOrders.filter(order => order.id !== action.payload);
    },
    clearRecentOrders(state) {
      state.recentOrders = [];
      },
      deleteRow: (state, action: PayloadAction<string>) => {
        state.data = state.data.filter(item => item.id !== action.payload);
      },
  },
});

export const {
  setData,
  setSelectedRows,
  setSortConfig,
  setProgressFilter,
  setVisibleColumns,
  setDarkMode,
  setCurrentPage,
  addRecentOrder,
  deleteRecentOrder,
    clearRecentOrders,
    deleteRow
} = recentOrderReducer.actions;

export default recentOrderReducer.reducer;
