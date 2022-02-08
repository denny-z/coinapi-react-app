import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchHistory, HistoryRequest } from './cryptoDashboardAPI';

interface MarketData {
  price: number,
  date: Date,
};

export interface CryptoDashboardState {
  selectedPair: string | null,
  chartData: Array<any> | null,  // TODO: Add type for this structure
  marketData: MarketData | null,
};

const initialState: CryptoDashboardState = {
  selectedPair: null,
  chartData: null,
  marketData: null,
};

// TODO: Add error handling.
// TODO: Add websocket destroy and subscription.
export const changePairAsync = createAsyncThunk(
  'cryptoDashboard/changePairAsync',
  async (newPair: string) => {
    // TODO: Add validation to the search input.
    const [leftAsset, rightAsset] = newPair.split('/');

    // IDEA: Add selector to be able to select period. 
    //   If so, calculate start/end date to get some amount of data.
    // TODO: Use a variable instead of magic string.
    const period = '1HRS';

    const HOURS_20_IN_MS = 20 * 60 * 60 * 1000;
    const currentMs = Date.now();
    const endDate = new Date(currentMs);
    const startDate = new Date(currentMs - HOURS_20_IN_MS);

    const request: HistoryRequest = {
      leftAsset,
      rightAsset,
      startDate,
      endDate,
      period,
    };

    const response = await fetchHistory(request);
    return response.json();
  }
)

const slice = createSlice({
  name: 'cryptoDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePairAsync.fulfilled, (state, action) => {
        state.chartData = action.payload;
      });
  }
});

export default slice.reducer;

export interface ChartData {
  x: Date,
  y: [number, number, number, number]
}

export const selectChartDataFormatted = (state: RootState): Array<ChartData> => {
  if (!state.cryptoDashboard.chartData) return [];
  
  return state.cryptoDashboard.chartData.map(
    (item) => {
      const formattedItem: ChartData = {
        x: item.time_open,
        y: [item.rate_open, item.rate_high, item.rate_low, item.rate_close],
      }
      return formattedItem;
    });
}