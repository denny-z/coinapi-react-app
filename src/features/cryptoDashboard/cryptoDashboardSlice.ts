import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import formatPrice from '../../utils';
import { fetchHistory, HistoryRequest } from './cryptoDashboardAPI';

// TODO: Move these types to a separate file or make available globally.
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

type DataStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface CryptoDashboardState {
  selectedPair: Pair | null,
  historicalData: Array<any> | null,  // TODO: Add type for this structure from API
  historicalDataStatus: DataStatus,
  marketData: MarketData | null,
  marketDataStatus: DataStatus
};

const initialState: CryptoDashboardState = {
  selectedPair: null,
  historicalData: null,
  historicalDataStatus: 'idle',
  marketData: null,
  marketDataStatus: 'idle',
};

export const changePairAsync = createAsyncThunk(
  'cryptoDashboard/changePairAsync',
  async (newPair: string, { dispatch }) => {
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
      state.marketData = action.payload;
      state.marketDataStatus = 'loaded';
    },
    setLoadingToMarketData: (state) => {
      state.marketDataStatus = 'loading';
    },
    setErrorToMarketData: (state) => {
      state.marketDataStatus = 'error';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePairAsync.pending, (state) => {
        state.historicalDataStatus = 'loading';
      })
      .addCase(changePairAsync.fulfilled, (state, action) => {
        state.historicalData = action.payload;
        state.historicalDataStatus = 'loaded';
      })
      .addCase(changePairAsync.rejected, (state) => {
        state.historicalDataStatus = 'error';
      });
  }
});

export const { 
  changePair, 
  updateMarketData, 
  setErrorToMarketData,
   setLoadingToMarketData 
} = slice.actions;

export default slice.reducer;

// Selectors

export interface HistoricalData {
  x: Date,
  y: [number, number, number, number]
}

export const selectChartDataFormatted = (state: RootState): Array<HistoricalData> => {
  if (!state.cryptoDashboard.historicalData) return [];

  return state.cryptoDashboard.historicalData.map(
    (item) => {
      const formattedItem: HistoricalData = {
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

export const selectMarketDataStatus = (state: RootState): DataStatus => {
  return state.cryptoDashboard.marketDataStatus;
}

export const selectHistoryDataStatus = (state: RootState): DataStatus => {
  return state.cryptoDashboard.historicalDataStatus;
}