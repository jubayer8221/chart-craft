import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartCardProps } from '@/types/chartTypes';

interface ChartState {
  charts: ChartCardProps[];
  selected: string[];
}

const initialState: ChartState = {
  charts: [
    {
      id: '1',
      title: 'Sales Data',
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb'],
        datasets: [
          {
            label: 'Sales',
            data: [120, 200],
            backgroundColor: ['#00A9B4', '#007EA1'],
          },
        ],
      },
    },
  ],
  selected: [],
};

const chartThemeSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    editChart: (
      state,
      action: PayloadAction<{ id: string; data: ChartCardProps['data'] }>
    ) => {
      const index = state.charts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.charts[index].data = action.payload.data;
      }
    },
    selectChart: (
      state,
      action: PayloadAction<{ id: string; selected: boolean }>
    ) => {
      const { id, selected } = action.payload;
      if (selected) {
        state.selected.push(id);
      } else {
        state.selected = state.selected.filter((sid) => sid !== id);
      }
    },
  },
});

export const { editChart, selectChart } = chartThemeSlice.actions;
export default chartThemeSlice.reducer;
