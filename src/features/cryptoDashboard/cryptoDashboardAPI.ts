const EXCHANGE_BASE_URL = 'https://rest.coinapi.io/v1/exchangerate';
const API_KEY = 'C00C804D-6A34-4DDB-B59D-2884162714FD';

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