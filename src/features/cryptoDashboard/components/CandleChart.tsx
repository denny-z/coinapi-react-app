import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';
import { useAppSelector } from '../../../app/hooks';
import { selectChartDataFormatted } from '../cryptoDashboardSlice';

export default function CandleChart() {
  // TODO: Add spinner when data is loading.
  const chartData = useAppSelector(selectChartDataFormatted);
  
  // TODO: Show a placeholder when no data provided;
  if (chartData.length === 0) return null;
  
  const series = [{data: chartData}];

  const options = {
    xaxis: {
      type: 'datetime',
    }, 
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value: number) => {
          return value < 1 ? value.toFixed(6) : value.toFixed(2);
        },
      },
    },
  } as ApexOptions;  
  
  return (
    <Chart 
      series={series}
      options={options}
      type="candlestick"
    />
  );
}