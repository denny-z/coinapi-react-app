import { MarketData, Pair, updateMarketData } from './cryptoDashboardSlice';

// TODO: Move the constants to env file.
const EXCHANGE_BASE_URL = 'https://rest.coinapi.io/v1/exchangerate';
const API_KEY = 'C00C804D-6A34-4DDB-B59D-2884162714FD';
const EXCHANGE_WS_URL = 'wss://ws-sandbox.coinapi.io/v1/';

function buildHistoryUrl(request: HistoryRequest): string {
  const params = new URLSearchParams();
  params.set('time_start', request.startDate.toISOString());
  params.set('time_end', request.endDate.toISOString());
  params.set('period_id', request.period)
  
  return `${EXCHANGE_BASE_URL}/${request.leftAsset}/${request.rightAsset}/history?${params.toString()}`;
}

type HistoryPeriod = '1HRS' | '1DAY';

export interface HistoryRequest {
  leftAsset: string,
  rightAsset: string,
  startDate: Date,
  endDate: Date,
  period: HistoryPeriod,
}

export async function fetchHistory(request: HistoryRequest) {
  const url = buildHistoryUrl(request);

  return fetch(url, {
    method: 'GET',
    headers: {
      'X-CoinAPI-Key': API_KEY
    }
  });
}

let exchangeSocket: WebSocket;

const wsHelloMessageTemplate = {
  type: 'hello',
  apikey: API_KEY,
  subscribe_data_type: ['exrate'],
  subscribe_update_limit_ms_exrate: 1000,
};

function prepareWsHelloMessage(pair: Pair) {
  return {
    ...wsHelloMessageTemplate,
    subscribe_filter_asset_id: [`${pair.left}/${pair.right}`]
  }
}

export function subscribeToMarketData(pair: Pair): void {
  if (exchangeSocket) {
    exchangeSocket.close();
  }

  const socket = new WebSocket(EXCHANGE_WS_URL);
  socket.onopen = () => {
    const helloMessage = prepareWsHelloMessage(pair);
    socket.send(JSON.stringify(helloMessage));
  };
  // TODO: Add websocket event type. See gist: https://gist.github.com/QuadFlask/a8d50095dea9cfa3f056c07b796e7c95#file-websocket-d-ts-L63
  socket.onmessage = (event: any) => {
    const data = JSON.parse(event.data.toString());
    const marketData: MarketData = {
      price: data.rate,
      date: data.time,
    };
    // TODO: Fix circular dependency issue
    const { store } = require('../../app/store');
    store.dispatch(updateMarketData(marketData));
  };
  
  exchangeSocket = socket;
}