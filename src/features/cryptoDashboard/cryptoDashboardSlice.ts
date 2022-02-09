import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import formatPrice from '../../utils';
import { fetchHistory, HistoryRequest, subscribeToMarketData } from './cryptoDashboardAPI';

export interface MarketData {
  price: number,
  date: number,
};

export interface MarketDataFormatted {
  price: string,
  date: Date,
};

export interface Pair {
  left: string,
  right: string,
}

export interface CryptoDashboardState {
  selectedPair: Pair | null,
  chartData: Array<any> | null,  // TODO: Add type for this structure from API
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
  async (newPair: string, { dispatch }) => {
    // TODO: Add validation to the search input.
    const [leftAsset, rightAsset] = newPair.split('/');
    const pair: Pair = { left: leftAsset, right: rightAsset }

    dispatch(changePair(pair));

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
);

const slice = createSlice({
  name: 'cryptoDashboard',
  initialState,
  reducers: {
    changePair: (state, action: PayloadAction<Pair>) => {
      state.selectedPair = action.payload;
    },
    updateMarketData: (state, action: PayloadAction<MarketData>) => {
      state.marketData = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePairAsync.fulfilled, (state, action) => {
        state.chartData = action.payload;

        subscribeToMarketData(
          { ...state.selectedPair } as Pair,
        );
      });
  }
});

export const { changePair, updateMarketData } = slice.actions

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

export const selectPairString = (state: RootState): string | null => {
  const pair = state.cryptoDashboard.selectedPair;
  if (!pair) return null;

  return `${pair.left}/${pair.right}`;
}

export const selectMarketDataFormatted = (state: RootState): MarketDataFormatted | null => {
  const data = state.cryptoDashboard.marketData;
  if (!data) return null;

  return {
    price: formatPrice(data.price),
    date: new Date(data.date),
  } as MarketDataFormatted;
}