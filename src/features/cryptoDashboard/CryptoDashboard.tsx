import styles from './CryptoDashboard.module.css';
import CandleChart from './components/CandleChart';
import MarketDataTable from './components/MarketDataTable';
import SubscribeForm from './components/SubscribeForm';

export default function CryptoDashboard() {
  return (
    <>
      <SubscribeForm />

      <div className={styles.marketDataContainer}>
        <MarketDataTable />
      </div>

      <div className={styles.chartContainer}>
        <h2>Historical exchange reates</h2>
        <CandleChart />
      </div>
    </>
  )
};
