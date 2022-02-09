type HistoryPeriod = '1HRS' | '1DAY';

interface HistoryRequest {
  leftAsset: string,
  rightAsset: string,
  startDate: Date,
  endDate: Date,
  period: HistoryPeriod,
}


interface MarketData {
  price: number,
  date: number,
};

interface MarketDataFormatted {
  price: string,
  date: Date,
};

interface Pair {
  left: string,
  right: string,
}

interface HistoricalData {
  x: Date,
  y: [number, number, number, number]
}
