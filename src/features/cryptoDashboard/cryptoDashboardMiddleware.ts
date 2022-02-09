import { Action, Middleware } from '@reduxjs/toolkit';
import { subscribeToMarketData } from './cryptoDashboardAPI';
import { MarketData, updateMarketData } from './cryptoDashboardSlice';

export const cryptoDashboardMiddleware: Middleware<{}, any> =
  store => (next: (action: Action) => void) => (action: Action) => {
    // TODO: Try to use a constant for action type instead.
    if (action.type === 'cryptoDashboard/changePairAsync/fulfilled') {
      const { cryptoDashboard: { selectedPair: pair } } = store.getState();

      if (pair == null) {
        next(action)
      } else {
        subscribeToMarketData(
          pair,
          (m: MarketData): void => { store.dispatch(updateMarketData(m)); },
        );
      }
    }

    next(action);
  };