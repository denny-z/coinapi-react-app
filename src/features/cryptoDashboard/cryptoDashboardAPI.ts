// TODO: Move the constants below to env file.
const API_KEYS = [
  '3CFD5F1E-EDAF-4F44-9F87-E9E0DD4454C7',
  '69B52375-8F65-49C3-B485-A234D54F9181',
  'C00C804D-6A34-4DDB-B59D-2884162714FD',
];
let currentApiKeyIndex = 0;

const EXCHANGE_BASE_URL = 'https://rest.coinapi.io/v1/exchangerate';

const EXCHANGE_WS_URL = 'wss://ws-sandbox.coinapi.io/v1/';

const HTTP_STATUS_TOO_MANY_REQUESTS = 429;

function buildHistoryUrl(request: HistoryRequest): string {
  const params = new URLSearchParams();
  params.set('time_start', request.startDate.toISOString());
  params.set('time_end', request.endDate.toISOString());
  params.set('period_id', request.period)

  return `${EXCHANGE_BASE_URL}/${request.leftAsset}/${request.rightAsset}/history?${params.toString()}`;
}

export async function fetchHistory(request: HistoryRequest): Promise<any> {
  try {
    const url = buildHistoryUrl(request);

    const fetchResult = await fetch(url, {
      method: 'GET',
      headers: {
        'X-CoinAPI-Key': API_KEYS[currentApiKeyIndex]
      }
    });

    if (fetchResult.status === HTTP_STATUS_TOO_MANY_REQUESTS && currentApiKeyIndex < API_KEYS.length - 1) {
      currentApiKeyIndex++;
      return fetchHistory(request);
    }

    return await fetchResult.json();
  } catch (e) {
    console.error(e);
    return { error: 'Failed to fetch' };
  }
}

let exchangeSocket: WebSocket;

const wsHelloMessageTemplate = {
  type: 'hello',
  apikey: API_KEYS[currentApiKeyIndex],
  subscribe_data_type: ['exrate'],
  subscribe_update_limit_ms_exrate: 1000,
};

function prepareWsHelloMessage(pair: Pair) {
  return {
    ...wsHelloMessageTemplate,
    subscribe_filter_asset_id: [`${pair.left}/${pair.right}`]
  }
}

export function subscribeToMarketData(
  pair: Pair,
  onUpdate: (m: MarketData) => void,
  onError: () => void
): void {
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
    onUpdate(marketData);
  };

  socket.onerror = (event: any) => {
    onError();
  }

  socket.onclose = () => {
    console.warn('Socket is closed');
  }

  exchangeSocket = socket;
}
