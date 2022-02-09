// TODO: Move the constants below to env file.
const API_KEYS = [
  '3CFD5F1E-EDAF-4F44-9F87-E9E0DD4454C7',
  '69B52375-8F65-49C3-B485-A234D54F9181',
  'C00C804D-6A34-4DDB-B59D-2884162714FD',
];
let currentFetchApiKeyIndex = 0;
let currentWsApiKeyIndex = 0;
let socketReopenCount = 0;

const EXCHANGE_BASE_URL = 'https://rest.coinapi.io/v1/exchangerate';

const EXCHANGE_WS_URL = 'wss://ws-sandbox.coinapi.io/v1/';

const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
const WS_CODE_POLICY_VIOLATION = 1008;

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
        'X-CoinAPI-Key': API_KEYS[currentFetchApiKeyIndex]
      }
    });

    if (fetchResult.status === HTTP_STATUS_TOO_MANY_REQUESTS && currentFetchApiKeyIndex < API_KEYS.length - 1) {
      currentFetchApiKeyIndex++;
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
  subscribe_data_type: ['exrate'],
  subscribe_update_limit_ms_exrate: 1000,
};

function prepareWsHelloMessage(pair: Pair) {
  return {
    ...wsHelloMessageTemplate,
    apikey: API_KEYS[currentWsApiKeyIndex],
    subscribe_filter_asset_id: [`${pair.left}/${pair.right}`],
  };
}

export function subscribeToMarketData(
  pair: Pair,
  onUpdate: (m: MarketData) => void,
  onError: () => void
): void {
  if (exchangeSocket && exchangeSocket.readyState === WebSocket.OPEN) {
    const helloMessage = prepareWsHelloMessage(pair);
    exchangeSocket.send(JSON.stringify(helloMessage));
    return;
  }

  const socket = new WebSocket(EXCHANGE_WS_URL);

  socket.onopen = () => {
    const helloMessage = prepareWsHelloMessage(pair);
    exchangeSocket.send(JSON.stringify(helloMessage));
    console.info('Socket opened');
  };

  // TODO: Fix endless "Loading..." state when not available pair provided (e.g. "FIL/ETH") - no messages sent.
  socket.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data.toString());
    if (data.type === 'error') return;

    const marketData: MarketData = {
      price: data.rate,
      date: data.time,
    };
    onUpdate(marketData);
    socketReopenCount = 0;
  };

  socket.onerror = onError;

  socket.onclose = (event: CloseEvent) => {
    if (event.code === WS_CODE_POLICY_VIOLATION && socketReopenCount < API_KEYS.length - 1) {
      console.info('Reopening socket due to policy violation...');

      socketReopenCount++;
      if (++currentWsApiKeyIndex > API_KEYS.length - 1) currentWsApiKeyIndex = 0;

      subscribeToMarketData(pair, onUpdate, onError);
    } else {
      console.warn('Socket closed');
      onError();
    }
  }

  exchangeSocket = socket;
}
