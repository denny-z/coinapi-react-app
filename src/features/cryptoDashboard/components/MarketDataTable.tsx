import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectMarketDataFormatted, selectMarketDataStatus, selectPairString } from '../cryptoDashboardSlice';
import styles from '../CryptoDashboard.module.css';
import { Box } from '@mui/material';

const formatDateToDateAndTime = (date: Date): string => (
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
)

const MarketDataTable = () => {
  const marketData = useAppSelector(selectMarketDataFormatted);
  const marketDataStatus = useAppSelector(selectMarketDataStatus);
  
  const tableData = [{
    title: 'Pair',
    value: useAppSelector(selectPairString) || 'N/A',
  }, {
    title: 'Price',
    value: (marketDataStatus === 'loading' 
      ? 'Loading...' 
      : marketData?.price || 'N/A'),
  }, {
    title: 'Time',
    value: (marketDataStatus === 'loading'
      ? 'Loading...' 
      : marketData?.date ? formatDateToDateAndTime(marketData.date) : 'N/A'),
  }];
  
  const table = tableData.map((row) => {
    return (
      <div className={styles.marketDataItem} key={row.title}>
        <b>{row.title}</b>
        <div>{row.value}</div>
      </div>
    );
  });
  
  let status;
  switch(marketDataStatus) {
    case 'error':
      status = (<h4>Oops! There is an issue to load market data...</h4>);
      break;
  }
  
  return (
    <>
      <h2>Market Data</h2>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status}
      </Box>
      <div className={styles.marketDataTable}>
        {table}
      </div>
    </>
  );
}

export default MarketDataTable;
