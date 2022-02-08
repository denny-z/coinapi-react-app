import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const changePairAsync = createAsyncThunk(
  'cryptoDashboard/changePairAsync',
  async (newPair: string) => {
    // TODO: Add validation to the search input.
    const [leftAsset, rightAsset] = newPair.split('/');

    // IDEA: Add selector to be able to select period. 
    //   If so, calculate start/end date to get some amount of data.
    // TODO: Use a variable instead of magic string.
    const period = '1HRS';

    const TEN_HOURS_IN_MS = 10 * 60 * 60 * 1000;
    const currentMs = Date.now();
    const endDate = new Date(currentMs);
    const startDate = new Date(currentMs - TEN_HOURS_IN_MS);

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