import React, { FormEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './CryptoDashboard.module.css';
import { useAppDispatch } from '../../app/hooks';
import { changePairAsync } from './cryptoDashboardSlice';
import CandleChart from './components/CandleChart';

const actualInfo = [{
  title: 'Pair',
  value: 'BTC/USD',
}, {
  title: 'Price',
  value: '$ 48.126,233',
}, {
  title: 'Time',
  value: new Date().toLocaleDateString(),
}];

export default function CryptoDashboard() {
  const [pair, setPair] = useState('');
  const dispatch = useAppDispatch();
  
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(changePairAsync(pair));
  }
  
  const actualInfoTable = (
    actualInfo.map((row) => {
      return (
        <div className={styles.actualInfoItem} key={row.title}>
          <div style={{textAlign: "center"}}>{row.title}</div>
          <div>{row.value}</div>
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