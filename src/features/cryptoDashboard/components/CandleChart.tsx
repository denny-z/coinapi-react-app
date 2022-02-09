import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useAppSelector } from '../../../app/hooks';
import formatPrice from '../../../utils';
import { selectChartDataFormatted, selectHistoryDataStatus } from '../cryptoDashboardSlice';
import { CircularProgress } from '@mui/material';

export default function CandleChart() {
  const chartData = useAppSelector(selectChartDataFormatted);
  const historyDataStatus = useAppSelector(selectHistoryDataStatus);

  const series = [{ data: chartData }];

  const options = {
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      }
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: formatPrice,
      },
    },
  } as ApexOptions;

  const chart = chartData.length === 0
    ? null
    : <Chart series={series} options={options} type="candlestick" />

  let status;

  switch (historyDataStatus) {
    case 'idle':
      status = (<h4>No data yet. Try to subscribe to see the chart.</h4>);
      break;
    case 'loading':
      status = (<CircularProgress />)
      break;
    case 'error':
      status = (<h4>Sorry, something went wrong...</h4>)
      break;
    case 'loaded': 
      status = (<h5>Fluctuations for past 10 hours.</h5>);
      break;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status}
      </div>
      {chart}
    </>
  );
}
