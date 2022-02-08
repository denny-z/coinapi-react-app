import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cryptoDashboardReducer from '../features/cryptoDashboard/cryptoDashboardSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cryptoDashboard: cryptoDashboardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
