"use client";

import { useEffect, useState } from "react";
import { getSettings } from "../lib/store";
import styles from "./page.module.css";
import Clock from "../components/Clock";
import Weather from "../components/Weather";
import SunTimes from "../components/SunTimes";
import Transport from "../components/Transport";
import News from "../components/News";
import DailySpotlight from "../components/DailySpotlight";


export default function Home() {
  const [settings, setSettings] = useState({
    showWeather: true,
    showTransport: true,
    showNews: true,
    showSong: true,
    customMessage: ""
  });

  useEffect(() => {
    // Poll settings every 3 seconds to stay in sync with Remote
    async function load() {
      try {
        const s = await getSettings();
        setSettings(s);
      } catch (e) { console.error(e) }
    }
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      {/* Top Left: Clock (Always visible) */}
      <div className={styles.topLeft}>
        <Clock />
      </div>

      {/* Top Right: Weather & Sun */}
      {settings.showWeather && (
        <div className={styles.topRight}>
          <Weather />
          <div style={{ marginTop: '2rem' }}>
            <SunTimes />
          </div>
        </div>
      )}

      {/* Center: Song or Custom Message */}
      <div className={styles.center}>
        {settings.customMessage ? (
          <div style={{ fontSize: '3rem', fontWeight: 700, textAlign: 'center', maxWidth: '80vw' }}>
            {settings.customMessage}
          </div>
        ) : (
          settings.showSong && <DailySpotlight />
        )}
      </div>

      {/* Bottom Left: News */}
      {settings.showNews && (
        <div className={styles.bottomLeft}>
          <News />
        </div>
      )}

      {/* Bottom Right: Transport */}
      {settings.showTransport && (
        <div className={styles.bottomRight}>
          <Transport />
        </div>
      )}
    </main>
  );
}
