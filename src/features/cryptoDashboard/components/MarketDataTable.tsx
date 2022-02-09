import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectMarketDataFormatted, selectPairString } from '../cryptoDashboardSlice';
import styles from '../CryptoDashboard.module.css';

const formatDateToDateAndTime = (date: Date): string => (
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
)

const MarketDataTable = () => {
  const marketData = useAppSelector(selectMarketDataFormatted);
  
  const tableData = [{
    title: 'Pair',
    value: useAppSelector(selectPairString),
  }, {
    title: 'Price',
    value: marketData?.price || 'N/A',
  }, {
    title: 'Time',
    value: marketData?.date ? formatDateToDateAndTime(marketData.date) : 'N/A',
  }];
  
  const table = tableData.map((row) => {
    return (
      <div className={styles.marketDataItem} key={row.title}>
        <b>{row.title}</b>
        <div>{row.value || 'N/A'}</div>
      </div>)
  })
  
  return (
    <>
      <h2>Market Data</h2>
      <div className={styles.marketDataTable}>
        {table}
      </div>
    </>
  );
}

export default MarketDataTable;
