import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './CryptoDashboard.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changePairAsync, selectMarketDataFormatted, selectPairString } from './cryptoDashboardSlice';
import CandleChart from './components/CandleChart';

export default function CryptoDashboard() {
  const [pair, setPair] = useState('');
  const dispatch = useAppDispatch();
  
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(changePairAsync(pair));
  }
  
  const marketData = useAppSelector(selectMarketDataFormatted);
  
  const formatDateToDateAndTime = (date: Date): string => (
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  )
  
  const actualInfo = [{
    title: 'Pair',
    value: useAppSelector(selectPairString),
  }, {
    title: 'Price',
    value: marketData?.price || 'N/A',
  }, {
    title: 'Time',
    value: marketData?.date ? formatDateToDateAndTime(marketData.date) : 'N/A',
  }];
  
  const actualInfoTable = (
    actualInfo.map((row) => {
      return (
        <div className={styles.actualInfoItem} key={row.title}>
          <div style={{textAlign: "center"}}>{row.title}</div>
          <div>{row.value || 'N/A'}</div>
        </div>)
    })
  );
  
  return (
    <div className={styles.cryptoDashboard}>
      <div className={styles.subscribeContainer}>
        <form onSubmit={onSubmit} className={styles.subscribeForm}>
          <TextField 
            name="crypto-pair-name" 
            type="search" 
            label="Search pair" 
            placeholder="E.g. BTC/USD" 
            size="small"
            onChange={(event) => setPair(event.target.value)}
          />
          <Button type="submit" variant="contained">Subscribe</Button>
        </form>
      </div>
      <div className={styles.actualInfoContainer}>
        <h2>Market Data</h2>
        <div className={styles.actualInfoTable}>
          {actualInfoTable}
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h2>Charting Data</h2>
        <CandleChart />
      </div>
    </div>
  )
}