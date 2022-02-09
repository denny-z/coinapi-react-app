import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import cryptoDashboardReducer from '../features/cryptoDashboard/cryptoDashboardSlice';
import { cryptoDashboardMiddleware } from '../features/cryptoDashboard/cryptoDashboardMiddleware';

export const store = configureStore({
  reducer: {
    cryptoDashboard: cryptoDashboardReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(cryptoDashboardMiddleware)
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
