import styles from "./page.module.css";
import Clock from "../components/Clock";
import Weather from "../components/Weather";
import SunTimes from "../components/SunTimes";
import Transport from "../components/Transport";
import News from "../components/News";
import DailySpotlight from "../components/DailySpotlight";


export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.topLeft}>
        <Clock />
      </div>
      <div className={styles.topRight}>
        <Weather />
        <div style={{ marginTop: '2rem' }}>
          <SunTimes />
        </div>
      </div>

      <div className={styles.center}>
        <DailySpotlight />
      </div>

      <div className={styles.bottomLeft}>
        <News />
      </div>
      <div className={styles.bottomRight}>
        <Transport />
      </div>
    </main>
  );
}
