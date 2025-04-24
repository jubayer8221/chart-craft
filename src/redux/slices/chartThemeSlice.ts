// redux/slices/chartThemeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChartData, ChartType, ChartState } from '@/types/chartTypes';

const initialState: ChartState = {
  charts: [
    {
      id: '1',
      title: 'Sales Data',
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Sales',
            data: [120, 200, 150],
            backgroundColor: ['#00A9B4', '#007EA1', '#004F71'],
            borderColor: ['#fff'],
          },
        ],
      },
      editable: true,
      selectable: true,
    },
    {
      id: '2',
      title: 'User Distribution',
      type: 'pie',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
          {
            label: 'Users',
            data: [55, 35, 10],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      editable: true,
      selectable: true,
    },
    {
      id: '3',
      title: 'Visitors Over Time',
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3'],
        datasets: [
          {
            label: 'Visitors',
            data: [300, 500, 400],
            // borderColor: 'rgba(75,192,192,1)',
            // backgroundColor: 'rgba(75,192,192,0.2)',
            // tension: 0.4,
            // fill: true,
          },
        ],
      },
      editable: true,
      selectable: true,
    },
  ],
  selectedChartIds: [],
};


export const chartThemeSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    editChart: (state, action: PayloadAction<{ id: string; data: ChartData }>) => {
      const chart = state.charts.find(c => c.id === action.payload.id);
      if (chart) chart.data = action.payload.data;
    },
    selectChart: (state, action: PayloadAction<{ id: string; selected: boolean }>) => {
      const { id, selected } = action.payload;
      state.selectedChartIds = selected
        ? [...state.selectedChartIds, id]
        : state.selectedChartIds.filter(sid => sid !== id);
    },
    updateChartType: (state, action: PayloadAction<{ id: string; type: ChartType }>) => {
      const chart = state.charts.find(c => c.id === action.payload.id);
      if (chart) chart.type = action.payload.type;
    },
  },
});

export const { editChart, selectChart, updateChartType } = chartThemeSlice.actions;
export default chartThemeSlice.reducer;