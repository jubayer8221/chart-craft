import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartData, ChartType } from '@/types/chart';

interface ChartState {
  charts: ChartType[];
  selectedCharts: string[];
  exportTypes: string[];
}

const initialCharts: ChartType[] = [
  {
    id: 'chart1',
    title: 'Sales Data',
    type: 'bar',
    data: [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 200 },
    ],
    color: 'rgba(0,169,180,0.6)',
  },
  {
    id: 'chart2',
    title: 'Profit Chart',
    type: 'line',
    data: [
      { label: 'Q1', value: 500 },
      { label: 'Q2', value: 400 },
    ],
    color: 'rgba(10,58,102,0.6)',
  },
];

const initialState: ChartState = {
  charts: initialCharts,
  selectedCharts: [],
  exportTypes: [],
};

// Validate ChartType object
const isValidChartType = (chart: unknown): chart is ChartType => {
  return (
    typeof chart === 'object' &&
    chart !== null &&
    'id' in chart &&
    typeof chart.id === 'string' &&
    'title' in chart &&
    typeof chart.title === 'string' &&
    'type' in chart &&
    ['bar', 'line', 'pie'].includes(chart.type as string) &&
    'data' in chart &&
    Array.isArray(chart.data) &&
    chart.data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'label' in item &&
        typeof item.label === 'string' &&
        'value' in item &&
        typeof item.value === 'number'
    ) &&
    'color' in chart &&
    typeof chart.color === 'string'
  );
};

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setCharts: (state, action: PayloadAction<ChartType[]>) => {
      const validCharts = action.payload.filter(isValidChartType);
      state.charts = validCharts.length > 0 ? validCharts : initialCharts;
      if (typeof window !== 'undefined') {
        localStorage.setItem('charts', JSON.stringify(state.charts));
      }
    },
    editChartData: (state, action: PayloadAction<{ id: string; data: ChartData[] }>) => {
      state.charts = state.charts.map((chart) =>
        chart.id === action.payload.id ? { ...chart, data: action.payload.data } : chart
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('charts', JSON.stringify(state.charts));
      }
    },
    changeChartType: (state, action: PayloadAction<{ id: string; type: ChartType['type'] }>) => {
      state.charts = state.charts.map((chart) =>
        chart.id === action.payload.id ? { ...chart, type: action.payload.type } : chart
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('charts', JSON.stringify(state.charts));
      }
    },
    changeChartColor: (state, action: PayloadAction<{ id: string; color: string }>) => {
      state.charts = state.charts.map((chart) =>
        chart.id === action.payload.id ? { ...chart, color: action.payload.color } : chart
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('charts', JSON.stringify(state.charts));
      }
    },
    toggleSelectedChart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedCharts = state.selectedCharts.includes(id)
        ? state.selectedCharts.filter((chartId) => chartId !== id)
        : [...state.selectedCharts, id];
    },
    toggleExportType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      state.exportTypes = state.exportTypes.includes(type)
        ? state.exportTypes.filter((t) => t !== type)
        : [...state.exportTypes, type];
    },
  },
});

export const {
  setCharts,
  editChartData,
  changeChartType,
  changeChartColor,
  toggleSelectedChart,
  toggleExportType,
} = chartSlice.actions;

export default chartSlice.reducer;