import { Action, Middleware } from '@reduxjs/toolkit';
import { subscribeToMarketData } from './cryptoDashboardAPI';
import { MarketData, Pair, setErrorToMarketData, setLoadingToMarketData, updateMarketData } from './cryptoDashboardSlice';

export const cryptoDashboardMiddleware: Middleware<{}, any> =
  store => (next: (action: Action) => void) => (action: Action & { payload: Pair }) => {
    // TODO: Try to use a constant for action type instead.
    if (action.type === 'cryptoDashboard/changePair') {
      const pair = action.payload;

      if (pair == null) {
        next(action)
      } else {
        store.dispatch(setLoadingToMarketData());

        subscribeToMarketData(
          pair,
          (m: MarketData): void => { store.dispatch(updateMarketData(m)); },
          () => { store.dispatch(setErrorToMarketData()) }
        );
      }
    }

    next(action);
  };
